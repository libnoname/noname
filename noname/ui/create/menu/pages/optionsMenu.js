import { popupContainer, menuxpages, createConfig, clickMenuItem, openMenu } from "../index.js";
import "../../../../../noname.js";
import { nonameInitialized } from "../../../../util/index.js";
import JSZip from "../../../../../_virtual/index2.js";
import { lib } from "../../../../library/index.js";
import { game } from "../../../../game/index.js";
import { get } from "../../../../get/index.js";
import { ui } from "../../../index.js";
import { _status } from "../../../../status/index.js";
const optionsMenu = function(connectMenu) {
  if (connectMenu) {
    return;
  }
  const cachePopupContainer = popupContainer;
  const cacheMenuxpages = menuxpages;
  var start = cacheMenuxpages.shift();
  var rightPane = start.lastChild;
  var clickMode = function() {
    var active2 = this.parentNode.querySelector(".active");
    if (active2 === this) {
      return;
    }
    active2.classList.remove("active");
    active2.link.remove();
    active2 = this;
    active2.classList.add("active");
    if (this.link) {
      rightPane.appendChild(this.link);
    } else {
      this._initLink();
      rightPane.appendChild(this.link);
    }
  };
  var clickAutoSkill = function(bool) {
    var name = this._link.config._name;
    var list = lib.config.autoskilllist;
    if (bool) {
      list.remove(name);
    } else {
      list.add(name);
    }
    game.saveConfig("autoskilllist", list);
  };
  var skilllistexpanded = game.expandSkills(lib.skilllist);
  for (var i in lib.skill) {
    if (!skilllistexpanded.includes(i)) {
      continue;
    }
    if (lib.skill[i].frequent && lib.translate[i]) {
      lib.configMenu.skill.config[i] = {
        name: lib.translate[i + "_noconf"] || lib.translate[i],
        init: true,
        type: "autoskill",
        onclick: clickAutoSkill,
        intro: lib.translate[i + "_info"]
      };
    }
  }
  var clickBanSkill = function(bool) {
    var name = this._link.config._name;
    var list = lib.config.forbidlist;
    if (bool) {
      list.remove(name);
    } else {
      list.add(name);
    }
    game.saveConfig("forbidlist", list);
  };
  var forbid = lib.config.forbid;
  if (!lib.config.forbidlist) {
    game.saveConfig("forbidlist", []);
  }
  for (var i = 0; i < forbid.length; i++) {
    var skip = false;
    var str = "";
    var str2 = "";
    var str3 = "";
    for (var j = 0; j < forbid[i].length; j++) {
      if (!lib.skilllist.includes(forbid[i][j])) {
        skip = true;
        break;
      }
      str += get.translation(forbid[i][j]) + "+";
      str2 += forbid[i][j] + "+";
      str3 += get.translation(forbid[i][j]) + "：" + lib.translate[forbid[i][j] + "_info"];
      if (j < forbid[i].length - 1) {
        str3 += '<div class="placeholder slim" style="display:block;height:8px"></div>';
      }
    }
    if (skip) {
      continue;
    }
    str = str.slice(0, str.length - 1);
    str2 = str2.slice(0, str2.length - 1);
    lib.configMenu.skill.config[str2] = {
      name: str,
      init: true,
      type: "banskill",
      onclick: clickBanSkill,
      intro: str3
    };
  }
  var updateView = null;
  var updateAppearence = null;
  var createModeConfig = function(mode, position) {
    var info = lib.configMenu[mode];
    var page = ui.create.div("");
    var node = ui.create.div(".menubutton.large", info.name, position, clickMode);
    node.mode = mode;
    node.link = page;
    var map = {};
    if (info.config) {
      var hiddenNodes = [];
      var autoskillNodes = [];
      var banskillNodes = [];
      var custombanskillNodes = [];
      var banskill;
      if (mode == "skill") {
        var autoskillexpanded = false;
        var banskillexpanded = false;
        ui.create.div(".config.more", "自动发动 <div>&gt;</div>", page, function() {
          if (autoskillexpanded) {
            this.classList.remove("on");
            for (var k2 = 0; k2 < autoskillNodes.length; k2++) {
              autoskillNodes[k2].style.display = "none";
            }
          } else {
            this.classList.add("on");
            for (var k2 = 0; k2 < autoskillNodes.length; k2++) {
              autoskillNodes[k2].style.display = "";
            }
          }
          autoskillexpanded = !autoskillexpanded;
        });
        banskill = ui.create.div(".config.more", "双将禁配 <div>&gt;</div>", page, function() {
          if (banskillexpanded) {
            this.classList.remove("on");
            for (var k2 = 0; k2 < banskillNodes.length; k2++) {
              banskillNodes[k2].style.display = "none";
            }
          } else {
            this.classList.add("on");
            for (var k2 = 0; k2 < banskillNodes.length; k2++) {
              banskillNodes[k2].style.display = "";
            }
          }
          banskillexpanded = !banskillexpanded;
        });
        var banskilladd = ui.create.div(".config.indent", '<span class="pointerdiv">添加...</span>', page, function() {
          this.nextSibling.classList.toggle("hidden");
        });
        banskilladd.style.display = "none";
        banskillNodes.push(banskilladd);
        var banskilladdNode = ui.create.div(".config.indent.hidden.banskilladd", page);
        banskilladdNode.style.display = "none";
        banskillNodes.push(banskilladdNode);
        var matchBanSkill = function(skills1, skills2) {
          if (skills1.length != skills2.length) {
            return false;
          }
          for (var i3 = 0; i3 < skills1.length; i3++) {
            if (!skills2.includes(skills1[i3])) {
              return false;
            }
          }
          return true;
        };
        var deleteCustomBanSkill = function() {
          for (var i3 = 0; i3 < lib.config.customforbid.length; i3++) {
            if (matchBanSkill(lib.config.customforbid[i3], this.parentNode.link)) {
              lib.config.customforbid.splice(i3--, 1);
              break;
            }
          }
          game.saveConfig("customforbid", lib.config.customforbid);
          this.parentNode.remove();
        };
        var createCustomBanSkill = function(skills) {
          var node2 = ui.create.div(".config.indent.toggle");
          node2.style.display = "none";
          node2.link = skills;
          banskillNodes.push(node2);
          custombanskillNodes.push(node2);
          var str4 = get.translation(skills[0]);
          for (var i3 = 1; i3 < skills.length; i3++) {
            str4 += "+" + get.translation(skills[i3]);
          }
          node2.innerHTML = str4;
          var span = document.createElement("span");
          span.classList.add("cardpiledelete");
          span.innerHTML = "删除";
          span.onclick = deleteCustomBanSkill;
          node2.appendChild(span);
          page.insertBefore(node2, banskilladdNode.nextSibling);
          return node2;
        };
        for (var i2 = 0; i2 < lib.config.customforbid.length; i2++) {
          createCustomBanSkill(lib.config.customforbid[i2]);
        }
        (function() {
          var list = [];
          for (var i3 in lib.character) {
            if (lib.character[i3][3].length) {
              list.push([i3, lib.translate[i3]]);
            }
          }
          if (!list.length) {
            return;
          }
          list.sort(function(a, b) {
            a = a[0];
            b = b[0];
            var aa = a, bb = b;
            if (aa.includes("_")) {
              aa = aa.slice(aa.lastIndexOf("_") + 1);
            }
            if (bb.includes("_")) {
              bb = bb.slice(bb.lastIndexOf("_") + 1);
            }
            if (aa != bb) {
              return aa > bb ? 1 : -1;
            }
            return a > b ? 1 : -1;
          });
          var list2 = [];
          var skills = lib.character[list[0][0]][3];
          for (var i3 = 0; i3 < skills.length; i3++) {
            list2.push([skills[i3], lib.translate[skills[i3]]]);
          }
          var selectname = ui.create.selectlist(list, list[0], banskilladdNode);
          selectname.onchange = function() {
            var skills2 = lib.character[this.value][3];
            skillopt.innerHTML = "";
            for (var i4 = 0; i4 < skills2.length; i4++) {
              var option = document.createElement("option");
              option.value = skills2[i4];
              option.innerHTML = lib.translate[skills2[i4]];
              skillopt.appendChild(option);
            }
          };
          selectname.style.maxWidth = "85px";
          var skillopt = ui.create.selectlist(list2, list2[0], banskilladdNode);
          var span = document.createElement("span");
          span.innerHTML = "＋";
          banskilladdNode.appendChild(span);
          var br = document.createElement("br");
          banskilladdNode.appendChild(br);
          var selectname2 = ui.create.selectlist(list, list[0], banskilladdNode);
          selectname2.onchange = function() {
            var skills2 = lib.character[this.value][3];
            skillopt2.innerHTML = "";
            for (var i4 = 0; i4 < skills2.length; i4++) {
              var option = document.createElement("option");
              option.value = skills2[i4];
              option.innerHTML = lib.translate[skills2[i4]];
              skillopt2.appendChild(option);
            }
          };
          selectname2.style.maxWidth = "85px";
          var skillopt2 = ui.create.selectlist(list2, list2[0], banskilladdNode);
          var confirmbutton = document.createElement("button");
          confirmbutton.innerHTML = "确定";
          banskilladdNode.appendChild(confirmbutton);
          confirmbutton.onclick = function() {
            var skills2 = [skillopt.value, skillopt2.value];
            if (skills2[0] == skills2[1]) {
              skills2.shift();
            }
            if (!lib.config.customforbid) {
              return;
            }
            for (var i4 = 0; i4 < lib.config.customforbid.length; i4++) {
              if (matchBanSkill(lib.config.customforbid[i4], skills2)) {
                return;
              }
            }
            lib.config.customforbid.push(skills2);
            game.saveConfig("customforbid", lib.config.customforbid);
            createCustomBanSkill(skills2).style.display = "";
          };
        })();
        page.style.paddingBottom = "10px";
      }
      var config = lib.config;
      if (mode == "appearence") {
        updateAppearence = function() {
          info.config.update(config, map);
        };
      } else if (mode == "view") {
        updateView = function() {
          info.config.update(config, map);
        };
      }
      for (var j2 in info.config) {
        if (j2 === "update") {
          continue;
        }
        var cfg = get.copy(info.config[j2]);
        cfg._name = j2;
        if (j2 in config) {
          cfg.init = config[j2];
        } else if (cfg.type != "autoskill" && cfg.type != "banskill") {
          game.saveConfig(j2, cfg.init);
        }
        if (!cfg.onclick) {
          cfg.onclick = function(result) {
            var cfg2 = this._link.config;
            game.saveConfig(cfg2._name, result);
            if (cfg2.onsave) {
              cfg2.onsave.call(this, result);
            }
          };
        }
        if (info.config.update) {
          if (mode == "appearence" || mode == "view") {
            cfg.update = function() {
              if (updateAppearence) {
                updateAppearence();
              }
              if (updateView) {
                updateView();
              }
            };
          } else {
            cfg.update = function() {
              info.config.update(config, map);
            };
          }
        }
        var cfgnode = createConfig(cfg);
        if (cfg.type == "autoskill") {
          autoskillNodes.push(cfgnode);
          cfgnode.classList.add("indent");
          cfgnode.style.display = "none";
        } else if (cfg.type == "banskill") {
          banskillNodes.push(cfgnode);
          cfgnode.classList.add("indent");
          cfgnode.style.display = "none";
        }
        if (j2 == "import_data_button") {
          ui.import_data_button = cfgnode;
          cfgnode.hide();
          cfgnode.querySelector("button").onclick = function() {
            var fileToLoad = this.previousSibling.files[0];
            if (fileToLoad) {
              var fileReader = new FileReader();
              fileReader.onload = function(fileLoadedEvent) {
                var data = fileLoadedEvent.target.result;
                if (!data) {
                  return;
                }
                try {
                  data = JSON.parse(lib.init.decode(data));
                  if (!data || typeof data != "object") {
                    throw new Error("err");
                  }
                  if (lib.db && (!data.config || !data.data)) {
                    throw new Error("err");
                  }
                } catch (e) {
                  console.log(e);
                  alert("导入失败");
                  return;
                }
                alert("导入成功");
                if (!lib.db) {
                  var noname_inited = localStorage.getItem("noname_inited");
                  var onlineKey = localStorage.getItem(lib.configprefix + "key");
                  localStorage.clear();
                  if (noname_inited) {
                    localStorage.setItem("noname_inited", noname_inited);
                  }
                  if (onlineKey) {
                    localStorage.setItem(lib.configprefix + "key", onlineKey);
                  }
                  for (var i3 in data) {
                    localStorage.setItem(i3, data[i3]);
                  }
                } else {
                  for (var i3 in data.config) {
                    game.putDB("config", i3, data.config[i3]);
                    lib.config[i3] = data.config[i3];
                  }
                  for (var i3 in data.data) {
                    game.putDB("data", i3, data.data[i3]);
                  }
                }
                lib.init.background();
                game.reload();
              };
              fileReader.readAsText(fileToLoad, "UTF-8");
            }
          };
        } else if (j2 == "import_music") {
          cfgnode.querySelector("button").onclick = function() {
            if (_status.music_importing) {
              return;
            }
            _status.music_importing = true;
            var fileToLoad = this.previousSibling.files[0];
            if (fileToLoad) {
              if (!lib.config.customBackgroundMusic) {
                lib.config.customBackgroundMusic = {};
              }
              var name = fileToLoad.name;
              if (name.includes(".")) {
                name = name.slice(0, name.indexOf("."));
              }
              var link = (game.writeFile ? "cdv_" : "custom_") + name;
              if (lib.config.customBackgroundMusic[link]) {
                if (!confirm("已经存在文件名称相同的背景音乐，是否仍然要继续导入？")) {
                  _status.music_importing = false;
                  return;
                }
                for (var i3 = 1; i3 < 1e3; i3++) {
                  if (!lib.config.customBackgroundMusic[link + "_" + i3]) {
                    link = link + "_" + i3;
                    break;
                  }
                }
              }
              var callback = function() {
                var nodexx = ui.background_music_setting;
                var nodeyy = nodexx._link.menu;
                var nodezz = nodexx._link.config;
                var musicname = link.slice(link.indexOf("_") + 1);
                game.prompt("###请输入音乐的名称###" + musicname, true, function(str4) {
                  if (str4) {
                    musicname = str4;
                  }
                  lib.config.customBackgroundMusic[link] = musicname;
                  lib.config.background_music = link;
                  lib.config.all.background_music.add(link);
                  game.saveConfig("background_music", link);
                  game.saveConfig("customBackgroundMusic", lib.config.customBackgroundMusic);
                  nodezz.item[link] = lib.config.customBackgroundMusic[link];
                  var textMenu = ui.create.div("", lib.config.customBackgroundMusic[link], nodeyy, clickMenuItem, nodeyy.childElementCount - 2);
                  textMenu._link = link;
                  nodezz.updatex.call(nodexx, []);
                  _status.music_importing = false;
                  if (!_status._aozhan) {
                    game.playBackgroundMusic();
                  }
                });
              };
              if (game.writeFile) {
                game.writeFile(fileToLoad, "audio/background", link + ".mp3", callback);
              } else {
                game.putDB("audio", link, fileToLoad, callback);
              }
            }
          };
        } else if (j2 == "extension_source") {
          ui.extension_source = cfgnode;
          cfgnode.updateInner = function() {
            this._link.choosing.innerHTML = lib.config.extension_source;
          };
        }
        map[j2] = cfgnode;
        if (!cfg.unfrequent) {
          if (cfg.type == "autoskill") {
            page.insertBefore(cfgnode, banskill);
          } else {
            page.appendChild(cfgnode);
          }
        } else {
          hiddenNodes.push(cfgnode);
        }
      }
      var expanded = false;
      if (hiddenNodes.length) {
        page.classList.add("morenodes");
        for (var k = 0; k < hiddenNodes.length; k++) {
          page.appendChild(hiddenNodes[k]);
        }
      }
      if (info.config.update) {
        info.config.update(config, map);
      }
    }
    return node;
  };
  for (var i in lib.configMenu) {
    if (i != "others") {
      createModeConfig(i, start.firstChild);
    }
  }
  (function() {
    if (!lib.node?.fs || !window.resolveLocalFileSystemURL) {
      return;
    }
    var page = ui.create.div("#create-extension");
    var node = ui.create.div(".menubutton.large", "文件", start.firstChild, clickMode);
    node.mode = "create";
    node._initLink = function() {
      node.link = page;
      var pageboard = ui.create.div(page);
      var importextensionexpanded = false;
      var importExtension;
      var extensionnode = ui.create.div(".config.more", "导入素材包 <div>&gt;</div>", pageboard, function() {
        if (importextensionexpanded) {
          this.classList.remove("on");
          importExtension.style.display = "none";
        } else {
          this.classList.add("on");
          importExtension.style.display = "";
        }
        importextensionexpanded = !importextensionexpanded;
      });
      extensionnode.style.padding = "13px 33px 4px";
      extensionnode.style.left = "0px";
      importExtension = ui.create.div(".new_character.export.import", pageboard);
      importExtension.style.padding = "0px 33px 10px";
      importExtension.style.display = "none";
      importExtension.style.width = "100%";
      importExtension.style.textAlign = "left";
      ui.create.div("", '<input type="file" accept="application/zip" style="width:153px"><button>确定</button>', importExtension);
      var promptnode = ui.create.div("", '<div style="width:153px;font-size:small;margin-top:8px">', importExtension);
      promptnode.style.display = "none";
      importExtension.firstChild.lastChild.onclick = function() {
        if (promptnode.style.display != "none") {
          return;
        }
        var fileToLoad = this.previousSibling.files[0];
        if (fileToLoad) {
          promptnode.style.display = "";
          promptnode.firstChild.innerHTML = "正在解压...";
          var fileReader = new FileReader();
          fileReader.onload = function(fileLoadedEvent) {
            var data = fileLoadedEvent.target.result;
            var loadData = function() {
              var zip = new JSZip();
              zip.load(data);
              var images = [], audios = [], fonts = [], directories = {}, directoryList = [];
              Object.keys(zip.files).forEach((file) => {
                const parsedPath = lib.path.parse(file), directory = parsedPath.dir, fileExtension = parsedPath.ext.toLowerCase();
                if (directory.startsWith("audio") && (fileExtension == ".mp3" || fileExtension == ".ogg")) {
                  audios.push(file);
                } else if (directory.startsWith("font") && fileExtension == ".woff2") {
                  fonts.push(file);
                } else if (directory.startsWith("image") && (fileExtension == ".jpg" || fileExtension == ".png")) {
                  images.push(file);
                } else {
                  return;
                }
                if (!directories[directory]) {
                  directories[directory] = [];
                  directoryList.push(directory);
                }
                directories[directory].push(parsedPath.base);
              });
              if (audios.length || fonts.length || images.length) {
                var str4 = "";
                if (audios.length) {
                  str4 += audios.length + "个音频文件";
                }
                if (fonts.length) {
                  if (str4.length) {
                    str4 += "、";
                  }
                  str4 += fonts.length + "个字体文件";
                }
                if (images.length) {
                  if (str4.length) {
                    str4 += "、";
                  }
                  str4 += images.length + "个图片文件";
                }
                var filelist = audios.concat(fonts).concat(images);
                if (filelist.length > 200) {
                  str4 += "，导入时间可能较长";
                }
                var assetLoaded = function() {
                  promptnode.firstChild.innerHTML = '导入成功。<span class="hrefnode">重新启动</span><span class="closenode">×</span>';
                  promptnode.firstChild.querySelectorAll("span")[0].onclick = game.reload;
                  promptnode.firstChild.querySelectorAll("span")[1].onclick = function() {
                    promptnode.style.display = "none";
                  };
                };
                if (confirm("本次将导入" + str4 + "，是否继续？")) {
                  promptnode.firstChild.innerHTML = '正在导入... <span class="hrefnode">详细信息</span>';
                  promptnode.firstChild.querySelector("span.hrefnode").onclick = ui.click.consoleMenu;
                  if (lib.node && lib.node.fs) {
                    var writeFile = function() {
                      if (filelist.length) {
                        var str5 = filelist.shift();
                        game.print(str5.slice(str5.lastIndexOf("/") + 1));
                        lib.node.fs.writeFile(__dirname + "/" + str5, zip.files[str5].asNodeBuffer(), null, writeFile);
                      } else {
                        assetLoaded();
                      }
                    };
                    game.ensureDirectory(directoryList, writeFile);
                  } else {
                    var getDirectory = function() {
                      if (directoryList.length) {
                        var dir = directoryList.shift();
                        var filelist2 = directories[dir];
                        window.resolveLocalFileSystemURL(nonameInitialized + dir, function(entry) {
                          var writeFile2 = function() {
                            if (filelist2.length) {
                              var filename = filelist2.shift();
                              game.print(filename);
                              entry.getFile(filename, { create: true }, function(fileEntry) {
                                fileEntry.createWriter(function(fileWriter) {
                                  fileWriter.onwriteend = writeFile2;
                                  fileWriter.onerror = function(e) {
                                    game.print("Write failed: " + e.toString());
                                  };
                                  fileWriter.write(zip.files[dir + "/" + filename].asArrayBuffer());
                                });
                              });
                            } else {
                              getDirectory();
                            }
                          };
                          writeFile2();
                        });
                      } else {
                        assetLoaded();
                      }
                    };
                    game.ensureDirectory(directoryList, getDirectory);
                  }
                } else {
                  promptnode.style.display = "none";
                }
              } else {
                alert("没有检测到素材");
              }
            };
            loadData();
          };
          fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
        }
      };
      var dashboard = ui.create.div(pageboard);
      var clickDash = function() {
        ui.create.templayer();
        pageboard.hide();
        this.link.show();
        if (this.link.init) {
          this.link.init();
        }
      };
      var createDash = function(str1, str22, node2) {
        var dash = ui.create.div(".menubutton.large.dashboard");
        dashboard.appendChild(dash);
        page.appendChild(node2);
        dash.link = node2;
        node2.link = dash;
        dash.listen(clickDash);
        lib.setScroll(node2);
        ui.create.div("", str1, dash);
        ui.create.div("", str22, dash);
      };
      var createDash2 = function(str1, str22, path, page2) {
        var dash = ui.create.div(".menubutton.large.dashboard.dashboard2");
        page2.appendChild(dash);
        dash.listen(function() {
          page2.path = path;
          enterDirectory(page2, path);
        });
        ui.create.div("", str1, dash);
        ui.create.div("", str22, dash);
      };
      var removeFile = function(selected, page2) {
        if (lib.node && lib.node.fs) {
          var unlink = function() {
            if (selected.length) {
              lib.node.fs.unlink(__dirname + "/" + selected.shift().path, unlink);
            } else {
              enterDirectory(page2, page2.currentpath);
            }
          };
          unlink();
        } else {
          window.resolveLocalFileSystemURL(nonameInitialized + page2.currentpath, function(entry) {
            var unlink2 = function() {
              if (selected.length) {
                entry.getFile(selected.shift().filename, { create: false }, function(fileEntry) {
                  fileEntry.remove(unlink2);
                });
              } else {
                enterDirectory(page2, page2.currentpath);
              }
            };
            unlink2();
          });
        }
      };
      var clickDirectory = function() {
        if (_status.dragged) {
          return;
        }
        var page2 = this.parentNode.parentNode.parentNode;
        if (page2.deletebutton.classList.contains("active")) {
          if (confirm("确认删除" + this.innerHTML + "文件夹？（此操作不可撤销）")) {
            if (lib.node && lib.node.fs) {
              try {
                var removeDirectory = function(path, callback) {
                  lib.node.fs.readdir(__dirname + "/" + path, function(err, list) {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    var removeFile2 = function() {
                      if (list.length) {
                        var filename = list.shift();
                        var url = __dirname + "/" + path + "/" + filename;
                        if (lib.node.fs.statSync(url).isDirectory()) {
                          removeDirectory(path + "/" + filename, removeFile2);
                        } else {
                          lib.node.fs.unlink(url, removeFile2);
                        }
                      } else {
                        lib.node.fs.rmdir(__dirname + "/" + path, callback);
                      }
                    };
                    removeFile2();
                  });
                };
                removeDirectory(this.path, function() {
                  enterDirectory(page2, page2.currentpath);
                });
              } catch (e) {
                console.log(e);
              }
            } else {
              window.resolveLocalFileSystemURL(nonameInitialized + this.path, function(entry) {
                entry.removeRecursively(function() {
                  enterDirectory(page2, page2.currentpath);
                });
              });
            }
          }
          return;
        }
        enterDirectory(page2, this.path);
      };
      var clickFile = function() {
        if (_status.dragged) {
          return;
        }
        var page2 = this.parentNode.parentNode.parentNode;
        if (page2.deletebutton.classList.contains("active")) {
          if (confirm("确认删除" + this.innerHTML + "？（此操作不可撤销）")) {
            removeFile([this], page2);
          }
          return;
        }
        this.classList.toggle("thundertext");
        page2.clicked = true;
        if (this.ext == "jpg" || this.ext == "png") {
          if (this.classList.contains("thundertext")) {
            if (!this.previewnode) {
              this.previewnode = document.createElement("img");
              this.previewnode.src = lib.assetURL + this.path;
              this.previewnode.width = "60";
              this.previewnode.style.maxHeight = "120px";
              this.parentNode.appendChild(this.previewnode);
            }
          } else {
            if (this.previewnode) {
              this.previewnode.remove();
              delete this.previewnode;
            }
          }
        } else if (this.ext == "mp3" || this.ext == "ogg") {
          if (this.classList.contains("thundertext")) {
            if (!this.previewnode) {
              this.previewnode = game.playAudio(this.path.slice(6));
            }
          } else {
            if (this.previewnode) {
              this.previewnode.remove();
              delete this.previewnode;
            }
          }
        }
      };
      var clickFileList = function() {
        if (!this.parentNode) {
          return;
        }
        if (this.parentNode.clicked) {
          this.parentNode.clicked = false;
        } else {
          var selected = Array.from(this.querySelectorAll("span.thundertext"));
          for (var i2 = 0; i2 < selected.length; i2++) {
            selected[i2].classList.remove("thundertext");
            if (selected[i2].previewnode) {
              selected[i2].previewnode.remove();
              delete selected[i2].previewnode;
            }
          }
        }
      };
      var enterDirectory = function(page2, path) {
        page2.innerHTML = "";
        page2.currentpath = path;
        var backbutton = ui.create.div(".menubutton.round", "返", page2, function() {
          page2.clicked = false;
          clickFileList.call(filelist);
          if (page2.path == path) {
            page2.reset();
          } else {
            if (path.indexOf("/") == -1) {
              enterDirectory(page2, "");
            } else {
              enterDirectory(page2, path.slice(0, path.lastIndexOf("/")));
            }
          }
        });
        backbutton.style.zIndex = 1;
        backbutton.style.right = "10px";
        backbutton.style.bottom = "15px";
        var refresh = function() {
          enterDirectory(page2, path);
        };
        var addbutton = ui.create.div(".menubutton.round", "添", page2, function() {
          var pos1 = this.getBoundingClientRect();
          var pos2 = ui.window.getBoundingClientRect();
          openMenu(this.menu, {
            clientX: pos1.left + pos1.width + 5 - pos2.left,
            clientY: pos1.top - pos2.top
          });
        });
        addbutton.menu = ui.create.div(".menu");
        ui.create.div("", "添加文件", addbutton.menu, function() {
          cachePopupContainer.noclose = true;
        });
        var createDir = function(str4) {
          if (lib.node && lib.node.fs) {
            lib.node.fs.mkdir(__dirname + "/" + path + "/" + str4, refresh);
          } else {
            window.resolveLocalFileSystemURL(nonameInitialized + path, function(entry) {
              entry.getDirectory(str4, { create: true }, refresh);
            });
          }
        };
        ui.create.div("", "添加目录", addbutton.menu, function() {
          ui.create.templayer();
          game.prompt("输入目录名称", function(str4) {
            if (str4) {
              createDir(str4);
            }
          });
        });
        var input = document.createElement("input");
        input.className = "fileinput";
        input.type = "file";
        input.onchange = function() {
          var fileToLoad = input.files[0];
          game.print(fileToLoad.name);
          if (fileToLoad) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
              game.writeFile(e.target.result, path, fileToLoad.name, refresh);
            };
            fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
          }
        };
        addbutton.menu.firstChild.appendChild(input);
        addbutton.style.zIndex = 1;
        addbutton.style.right = "10px";
        addbutton.style.bottom = "80px";
        var deletebutton = ui.create.div(".menubutton.round", "删", page2, function() {
          if (!this.parentNode) {
            return;
          }
          if (!this.classList.contains("active")) {
            var selected = Array.from(filelist.querySelectorAll("span.thundertext"));
            if (selected.length) {
              if (confirm("一共要删除" + selected.length + "个文件，此操作不可撤销，是否确定？")) {
                removeFile(selected, page2);
              }
            } else {
              this.classList.add("active");
            }
          } else {
            this.classList.remove("active");
          }
        });
        deletebutton.style.zIndex = 1;
        deletebutton.style.right = "10px";
        deletebutton.style.bottom = "145px";
        page2.backbutton = backbutton;
        page2.addbutton = addbutton;
        page2.deletebutton = deletebutton;
        var filelist = ui.create.div(page2);
        filelist.classList.add("file-container");
        filelist.listen(clickFileList);
        lib.setScroll(filelist);
        game.getFileList(path, function(folders, files) {
          var sort = function(a, b) {
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          };
          folders.sort(sort);
          files.sort(sort);
          var parent = path;
          if (parent) {
            parent += "/";
          }
          for (var i2 = 0; i2 < folders.length; i2++) {
            if (!page2.path && folders[i2] == "app") {
              continue;
            }
            var entry = ui.create.div("", "<span>" + folders[i2], filelist);
            entry.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickDirectory);
            entry.firstChild.path = parent + folders[i2];
          }
          for (var i2 = 0; i2 < files.length; i2++) {
            if (!page2.path) {
              if (files[i2] == "app.html") {
                continue;
              }
              if (files[i2] == "main.js") {
                continue;
              }
              if (files[i2] == "package.json") {
                continue;
              }
            }
            var entry = ui.create.div("", "<span>" + files[i2], filelist);
            entry.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickFile);
            entry.firstChild.ext = files[i2].slice(files[i2].lastIndexOf(".") + 1);
            entry.firstChild.path = parent + files[i2];
            entry.firstChild.filename = files[i2];
          }
        });
      };
      var dash1 = (function() {
        var page2 = ui.create.div(".hidden.menu-buttons");
        page2.reset = function() {
          page2.innerHTML = "";
          var backbutton = ui.create.div(".menubutton.round", "返", page2, function() {
            ui.create.templayer();
            page2.hide();
            pageboard.show();
          });
          backbutton.style.zIndex = 1;
          backbutton.style.right = "10px";
          backbutton.style.bottom = "15px";
          var placeholder = ui.create.div(".placeholder", page2);
          placeholder.style.position = "relative";
          placeholder.style.display = "block";
          placeholder.style.width = "100%";
          placeholder.style.height = "14px";
          createDash2("将", "武将图片", "image/character", page2);
          createDash2("肤", "皮肤图片", "image/skin", page2);
          createDash2("卡", "卡牌图片", "image/card", page2);
          createDash2("模", "模式图片", "image/mode", page2);
          createDash2("始", "开始图片", "image/splash", page2);
          createDash2("景", "背景图片", "image/background", page2);
        };
        page2.reset();
        return page2;
      })();
      var dash2 = (function() {
        var page2 = ui.create.div(".hidden.menu-buttons");
        page2.reset = function() {
          page2.innerHTML = "";
          var backbutton = ui.create.div(".menubutton.round", "返", page2, function() {
            ui.create.templayer();
            page2.hide();
            pageboard.show();
          });
          backbutton.style.zIndex = 1;
          backbutton.style.right = "10px";
          backbutton.style.bottom = "15px";
          var placeholder = ui.create.div(".placeholder", page2);
          placeholder.style.position = "relative";
          placeholder.style.display = "block";
          placeholder.style.width = "100%";
          placeholder.style.height = "14px";
          createDash2("技", "技能配音", "audio/skill", page2);
          createDash2("卡", "男性卡牌", "audio/card/male", page2);
          createDash2("牌", "女性卡牌", "audio/card/female", page2);
          createDash2("亡", "阵亡配音", "audio/die", page2);
          createDash2("效", "游戏音效", "audio/effect", page2);
          createDash2("景", "背景音乐", "audio/background", page2);
        };
        page2.reset();
        return page2;
      })();
      var dash3 = (function() {
        var page2 = ui.create.div(".hidden.menu-buttons");
        page2.path = "font";
        page2.reset = function() {
          ui.create.templayer();
          page2.hide();
          pageboard.show();
        };
        page2.init = function() {
          enterDirectory(page2, "font");
        };
        return page2;
      })();
      var dash4 = (function() {
        var page2 = ui.create.div(".hidden.menu-buttons");
        page2.path = "";
        page2.reset = function() {
          ui.create.templayer();
          page2.hide();
          pageboard.show();
        };
        page2.init = function() {
          enterDirectory(page2, "");
        };
        return page2;
      })();
      createDash("图", "图片文件", dash1);
      createDash("音", "音频文件", dash2);
      createDash("字", "字体文件", dash3);
      createDash("全", "全部文件", dash4);
    };
    if (!get.config("menu_loadondemand")) {
      node._initLink();
    }
  })();
  createModeConfig("others", start.firstChild);
  var active = start.firstChild.querySelector(".active");
  if (!active) {
    active = start.firstChild.firstChild;
    active.classList.add("active");
  }
  if (!active.link) {
    active._initLink();
  }
  rightPane.appendChild(active.link);
};
export {
  optionsMenu
};
