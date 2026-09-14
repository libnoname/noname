"""Create runtime media from the untouched theme/动态资源 originals (no tests/build)."""
import argparse
from pathlib import Path
import shutil
import subprocess

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default=shutil.which("ffmpeg"))
    args = parser.parse_args()
    if not args.ffmpeg:
        parser.error("Provide --ffmpeg with an FFmpeg executable path")
    theme = Path(__file__).resolve().parents[1] / "apps/core/extension/红楼幻境/theme"
    output = theme / "motion"
    output.mkdir(exist_ok=True)
    total_source = total_runtime = 0
    for kind, folder, width, crf, rate in [
        ("portrait", "原画", 640, 22, "1300k"),
        ("background", "背景", 1280, 23, "1800k"),
    ]:
        for key in ("bamboo", "dream"):
            source = theme / "动态资源" / folder / f"daiyu-{key}.mp4"
            target = output / f"{kind}-{key}.mp4"
            # Cap width without upscaling; preserve source proportions and even dimensions.
            scale = f"scale=w='trunc(min(iw,{width})/2)*2':h=-2:flags=lanczos,setsar=1"
            subprocess.run([
                args.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                "-i", str(source), "-map", "0:v:0", "-an", "-sn", "-dn",
                "-vf", scale + ",fps=24", "-c:v", "libx264", "-preset", "slow",
                "-crf", str(crf), "-maxrate", rate, "-bufsize", "3600k",
                "-profile:v", "main", "-level:v", "3.1", "-pix_fmt", "yuv420p",
                "-g", "48", "-keyint_min", "48", "-sc_threshold", "0",
                "-threads", "2", "-map_metadata", "-1", "-movflags", "+faststart", str(target),
            ], check=True)
            # Match the first decoded video frame to avoid a pose/color jump on reveal.
            poster = output / f"{kind}-{key}.webp"
            result = subprocess.run([
                args.ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin",
                "-i", str(target), "-frames:v", "1", "-f", "image2pipe", "-c:v", "png", "pipe:1",
            ], check=True, stdout=subprocess.PIPE)
            from io import BytesIO
            with Image.open(BytesIO(result.stdout)) as frame:
                frame.convert("RGB").save(poster, "WEBP", quality=85, method=6)
            total_source += source.stat().st_size
            total_runtime += target.stat().st_size + poster.stat().st_size
            print(f"{target.name}: {target.stat().st_size:,} bytes; poster: {poster.stat().st_size:,} bytes", flush=True)
    print(f"Originals: {total_source:,}; runtime videos + posters: {total_runtime:,} bytes", flush=True)


if __name__ == "__main__":
    main()
