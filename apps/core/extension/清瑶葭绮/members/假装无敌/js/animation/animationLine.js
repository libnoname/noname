window.qyImport(async function (lib, game, ui, get, ai, _status, config) {

    if (!game.getExtensionConfig('假装无敌', 'qingyao_line_editor')) return;

    if (!lib.qyLoading) {
        return console.error("Line: 关键工具未加载！！！");
    }
    if (!Object.groupBy) {
        Object.groupBy = function(arr, callback) {
            return arr.reduce((grouped, item) => {
                const key = callback(item);
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item);
                return grouped;
            }, {});
        };
    }

    // 目录
    const dlcDirectory = 'extension/清瑶葭绮/members/假装无敌/js/db/line';
    // 特效类
    lib.qyLineItem = {}

    // 获取文件
    const dbList = await lib.getDBList(dlcDirectory);

    const dbListLoad = dbList.map(async dbName => {
        try {
            const db = new LocalFileDB(dlcDirectory, dbName);
            await db.init();
            if (!db.menu?.name) {
                db.menu = {
                    name: dbName,
                    label: dbName,
                    enable: true,
                }
            }
            await db.init();
            lib.qyLineItem[dbName] = db;
            return dbName;
        } catch (e) {
            throw {
                dbName,
                e,
            }
        }
    });

    let failMessage = '指示线加载失败：\n';
    await Promise.allSettled(dbListLoad)
        .then(async values => {
            for (const { status, value, reason } of values) {
                // 失败
                if (status === 'rejected') {
                    const { dbName, e } = reason;
                    failMessage += `【${dbName}】加载失败，错误信息：${e.message}\n`;
                    continue;
                }
            }
            return Promise.resolve(true);
        });

    // 加载错误
    if (failMessage !== '指示线加载失败：\n') {
        alert(failMessage);
    }

    const checkArrayFunc = (value, result, element) => {
        let errorMessage = '';
        try {
            value = eval(value || []);
            if (!Array.isArray(value)) {
                throw new IllegalArgumentError("必须是数组类型");
            }
        } catch (e) {
            errorMessage = "转换json错误：" + e.toString();
        }
        return {
            isOk: errorMessage === '',
            data: value,
            errorMessage,
        }
    }
    const onLoadArrayFunc = (node, animationItemValue, key) => {
        try {
            let animationItemValueElement = animationItemValue[key];
            if (!Array.isArray(animationItemValueElement)) {
                animationItemValueElement = [];
            }
            node.value = JSON.stringify(animationItemValueElement)
        } catch (e) {
        }
    }

    const a0_0x539d13=a0_0x5688,a0_0x5e8451=a0_0x24f8;(function(_0x12193b,_0x4805ed){const a0_0x228a03={_0x5c1fcf:0x190,_0x5ae49d:'GWkM',_0x1a651b:0x19f,_0x2db41f:'Pfv5',_0x4f8caa:0x2a5,_0x3d273a:'9r^2',_0x442446:0x1b9,_0x247a19:0x178,_0xe1732b:0x12e,_0x42e322:'K0&3',_0x21bafc:0x26e,_0x3b950b:'Pfv5',_0x1386de:0x1df,_0x4613f9:'N2t4'},_0x160e89=a0_0x5688,_0x3b7993=a0_0x24f8,_0x3e73eb=_0x12193b();while(!![]){try{const _0x4c2e56=-parseInt(_0x3b7993(a0_0x228a03._0x5c1fcf,a0_0x228a03._0x5ae49d))/0x1*(parseInt(_0x3b7993(a0_0x228a03._0x1a651b,a0_0x228a03._0x2db41f))/0x2)+parseInt(_0x3b7993(a0_0x228a03._0x4f8caa,a0_0x228a03._0x3d273a))/0x3*(-parseInt(_0x160e89(a0_0x228a03._0x442446))/0x4)+-parseInt(_0x160e89(a0_0x228a03._0x247a19))/0x5+-parseInt(_0x160e89(a0_0x228a03._0xe1732b))/0x6+-parseInt(_0x3b7993(0x242,a0_0x228a03._0x42e322))/0x7+-parseInt(_0x3b7993(a0_0x228a03._0x21bafc,a0_0x228a03._0x3b950b))/0x8+-parseInt(_0x3b7993(a0_0x228a03._0x1386de,a0_0x228a03._0x4613f9))/0x9*(-parseInt(_0x160e89(0x118))/0xa);if(_0x4c2e56===_0x4805ed)break;else _0x3e73eb['push'](_0x3e73eb['shift']());}catch(_0x5a127a){_0x3e73eb['push'](_0x3e73eb['shift']());}}}(a0_0x5969,0x50ec4));function a0_0x5969(){const _0x35027c=['Aw5WDxq','zgvSzxrL','fmo0W6D5','WQLlW60qW6C','WR/cKHSl','zxjYB3jnzxnZywDL','CxLFAgLKzgvU','umo7WQddMGFdOCoXEConWPa','rSkDWOVcMSkp','mtu0otGXmhzKC2jtDq','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBv9Uyw1Lx2nVBNrHAw5LCG','at5u','B25JAgfUz2u','BwfW','dSoVW4DL','WOSVEajSCNBcSw5HtSk/ca','W7iTc2tdHCkk','DgHLBG','WO7cVhruzCkXW5G/e1uuW4ZcQG','zCoDh8kkW4RdLSotW7nzWPS','A8oHACk8WRtdOvBcH2VcS0mqWRtcQIy','DMfSDwu','W7OTb2ZdHmkmhGK','ohNdGCoqWQGwBYDgW6RdMa','6k+36l6t5ywL57Ut5P2F5l2n572U','6k6U6l6o5yEa54UG5PAu5zg+56EY','smkuWOZcJmkTtgvdWRmkW5rfgHGWCdW','5OYj5l2pu2HPzNtMU5hLIQJMU5ROVA7MN6xNNiVMM7tLPjRPGiNPOBK','W7a2b8o+W6alsCkeW6DdWQTCWOdcJ1xcTSk0fCocW4LjrfddS8oOWRaqbSofWO4','yxbWzw5Kqw5PBwf0Aw9U','5OUj5lY46yoO5yIg','mJaXnZq0mgzLEhfhCG','BwvUDq','zMLUza','n1xcIrhcImkeWPNdJcJcVSk2WRFdT2RdLqtcO2BcVr8kW5jOW4fR','C2TPBgXmAw5L','WPCUbSkVkdtdM8kaW5ddMmo8nCkuWOn2W5pcNCkFW7aoW4iL','lh4ZW41fiNGgd8kvW7y','WR46W7dcK8o2eqe','tgVcMG','CxLvDgLSCW','Dgv4Da','5PQN5zcdWP/dVZ3dKUMRIUMRJa','dqxdLSkTWQ43DdG','WR8JW7tcN8o2lHFcPSogemoUW44GASoglbDFua','xhBcSMVcHSoSCCkWpCkG','B25nB3vUDa','fG/cOHldN8kmWP9pW7S','W7CMfMBdG8kwpWLxWOv6uq','dmoYW41NWQ7dMSkGW5BcHSkoaeiPkZ7cPSkg','C3bSAxq','aWBdOx44qdn5','cbNdUCk2WR0UDcVcRsJdLuuUDCkDot4OquJdQmoEW7y','zgvHza','W7a9cghdLmkq','ndi5nJK5ouDQrhPoyW','WPNdR8osFeVcKxP9WPRdOWqsfwntW7enACk7jNlcLa','CMvWBgfJzunOAwXK','hqxdGSk8WRSG','iKNdI8ofzx4','WR0IW77cMSoder3cPCoufSoOW58fASoj','pxJdG8o4WQKFDG','dZ5iFq','W6qKW4tdK8kAAfOB','ceFdVLG','z2v0','FW4TW6S','C2nHBgu','5PkT5Ps+5A6m5Q+v','5zoI5QYK5OIj5yU/','WO15dfm','ee3dSf3dRspcSmosugddMmkCW7KOaG','l3zdW75F','C2v0','eSoRW4XeWQRdU8kWW4a','mbJdNZ3cMCklWP7cNW','CxLNBg93','cCkXAJmKdYhcVY5fkW','c8kPFZuHdGy','WPOZb8kR','5Q2J5zYO5yIG6zMK77Ym6k+356In5zco44cc44cc44cc','zNjVBq','772xmMZdM1SNvva','yw5PBwf0Aw9UtgLZDa','CxLbBMLTyxrPB25mAw5LvxrPBa','v8ozx8kVWOhdJMVcVq','iZBcSXef','W6fjm8oHWR5ZCCkkW5W','BM9KzvrHzW','nCouW6zAr3ZdHG','WQDgWRZdUcG','WP01DHbqzu3cS2zHsmkUe8ofaW','WQnSaSkU','B25RzxLKB3DU','W4aOBqvT','csldLaiafa','mspcKqCtW5NdO8kLWRy','B25JBgLJAW','cGhdRMi8xa','WQnkW7mdW7RdJZddMG','WRePWPdcOmoocgVdO8kE','CxLmAw5LsxrLBq','ywXWAge','5l+U5Ps554M55Pwi5yIg57g777YA','ccRdLHmk','mZi1nZK1uxj1C1bM','umk4W5JdV8ktWQSCWO0','zCobdmkhW5tdSmoVW6rtWPDgAZ8','zw5Kug9ZAxrPB24','CxLbBMLTyxrPB25vDgLS','5PQ45lIq5PEu5O66572V6lYF5zo356sl77+W','AxndB3jYzwn0tNvTyMvY','hspdNWueaue+','5PUV5zg25yUV6zQS6k2c54Iv5Pwh776z77+45QYj5Poj5l+L5lU/5y+W5PgZ5zQP77+9','Ag92zxjuAw1L','i2eNW40','aCkYucuLbq','CM90yxrPB24','e8oOW4X3','dWhdGSkSWQO','WO96g1JcPIW','hqhdMSk4WRWGzq','W7WzC3q0','WPNdSSozAvRcMKO','B25mB2fK','6k+36l6t5ywL5Q2J56gU55Qe5PwW5A2x77Yb77Yb','jmoKFmoaWPpcLa','W7PaWR/dIrhdQaCu','aH7cUshdOmkqWPzwW73cQmoTW6JcNmkSW6S','wCo0kMb/uWVcKazqcui','s2BcKgy','C3rHCNrqB3nPDgLVBG','WQG5W6pcR8oYabO','AKhcNcVcISkE','eatcVZZdKCkwWPbjW7lcHSo4W7NcMa','C3ddJCoorq','wxlcLCophmoGWO4','54M55Pwi5zcn56EW','u1rsrvrdsa','zMLYzxrLEhq','WPJdSSotza','WRzLFCkLwG9e','iCoEW7LWuhRdRWFcN0jw','AgfZt3DUuhjVCgvYDhK','FCoJBmozWPNcKsK','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBv9JB250zw50x2nVBNrHAw5LCG','W5tdRmooqL7cMLD/WPJdOGayfuHXW6OnySk5jepcG8kAo8k0W7VcMWNdTCoaW45yW7GLW4q','WO93bLZcQdy5WOpdM8o8k8kanq','6ywn572Usuq','5Psp6l2c6ksl5BI9','BgfIzwW','WPmikmoK','qSoWWONdKH3dOq','Dg9mB3DLCKnHC2u','dY1bCd5u','y29UDgvUDa','WQi/WQdcPmocdwe','BgLZDgvU','WOuLl8kNmJtdLSkBW5BdGa','otq1nde2whn5q0HA','yw5PBwf0Aw9UsxrLBq','hGNdRhi2qWz5kKVdPrq','WPVdUCotweNcKvbMWRxdVXOdhNLWW7e','AM9PBG','lNf5x2fUAw1HDgLVBL9JDxn0B20GC2vSzwn0w25HBwu9ywn0Aw9Uxq','WPBcP39dBSkQW6KEoG','x3f5qw5PBwf0Aw9UtgLUzq','BMfTzq','aCkYwtK4gqFcTdnNoKpdHCkwfq','zgLHBg9NvhLWzq','mtzvqufTswG','WQBcGqi','ywrKrxzLBNrmAxn0zw5LCG','WRfYFSkLwWy','B2XKvMfSDwu','WQraW7eaW6FdJq','WQfRCSkOqY9zWQfe','WQLrW7Gi','WQq1WQNcQCosahVdKmkraxhdNa','ea7cSHtdHSkhWPDsW5dcPSo/W6JcKmkTW6ap','CMfUzg9Tr2v0CW','5yIG6zMK5OIq5yQF77Yb','fbJcPd7dGSkVWPXvW6/cRSoRW7K','phnWyw4+','6zQ75yMP5OYw56sC57QJ','l2eNW5e','CxLJB25MAxjT','W7KTc2BdG8kdcqndWR9DFCkW','C3r5Bgu','5l+U5Ps554M55Pwi5AsX6lsL77YA','WOy9dCkQmZZdMmkkW4C','uvNdRSoWW4z7lq','y8ktpmkisrRcJSk+WQVdSL0','W6PFWQddHcldSmk3u8o9x8kSoX7dQmousYKifmo4W6/cJmkvlCkJ','5B2t5yMn54Q25Ocb77YA','yWqZW6ldVbddUq','mCouW7bM','WOCUWQPYWOe','mtuWnJu4AuDbEuzS','ndi1mZy0r3vMD2HR','o3LQW7LffYfYW4JdMW','5PkT5Ps+5BU26l+F','WP7dTmob','C3LUyW','6k+36l6t5ywL54M55Pwi5yIg57g75zcn56EW','CxLpCgvUtgLUzuDYB3vWrwrPDg9Y','CMvTB3zL','C2HVDW','W590kHfWyNlcLg4','zgLZCgXHEq','CxLxB3jRzxjmAw5L','5BYa5zcV6kEM5y+r5PE25PY6','jM5IC3aMBMjZChWMBMjZCoEMGEEuQa','W6eYlSoZfLzHWR1uWONdTCou','WQa3W7ZcJW','W74WzIrDW6/dQCkIAmkBFSk5wa','khtdI8o+WQusBtvcW6RdHdtdPeldGtJcK1tcVMfCW4m7dspcUu7dSWyR','zw5HyMXL','WODTfvbZmG','hSoVW41XWQddLSkRW4hcSSkke2SfnYNcMCkBWRWEm8ogfW','W6fuhSoRWR5jqmkKW6r4W4CAW5FcPCoN','g8kQCZOMjWVcUsi','y2HLy2TbBMrhzxrmAw5Lug9PBNrLCG','W7GqAa','5lYQ5Psx5OUj5yIe','n2JdIa','6AUe6AUJ5zUA5Bgt','WRmGWQRcRCod','WPVdRCohEfhcKh16WPddUG0','dLpdUCk8WPm','qmoMWOG','m8oMzmoCWPK','Af3cVZ7cJmkeWRZdIcFcR8kAWRZdSehdNH8','WRTUDCkHxsTKWOjT','lNf5x2fUAw1HDgLVBL9IB3r0B21FyNv0Dg9Ux2nVBNrHAw5LCG','Dg9tDhjPBMC','Bg9VCa','vSkbWOVcL8kbz2rlWPWeW4m','WOGUAW','Aw5Zzxj0qMvMB3jL','n8oEW7j+u3pdMG','5l+U5Ps554M55Pwi','C2vSzwn0','AxnpAW','5PMw5zgg5yQo6zQ96kYQ5yMd57gQ772g77+P5QYJ5Pg55l295lMW5y+Q5Pgq5zQj772x5l235zc/5Q2F5yQN6zUi5P+G5z+K5Pws5lQ8776577YI77+k','W7yBF2SKxNBcNW','5PEr5AkQ54Ui5Pw75AA16lwR77+l','6k2O6l+n5ywQ5QYQ56gs55IF5PEW5A6A77Yh77+x','CxLpCgvUtgLUzunVBMzPz0vKAxrVCG','Aw5Uzxjive1m','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBv9PBMzVx2nVBNrHAw5LCG','Aw5JBhvKzxm','5PIV5zcM6yca5yE657Yw6l6r77YF','EKLUzgv4','yM9VBgvHBG','dt/dIa8bbeCGna','WOi7WQL3WRtcS1xcImkIW4SsWQiUAKW','W7yWzJ0','dWtdRwu8','BM9Kzq','zMLYC3rfBgvTzw50q2HPBgq','u8kqWO7cJmkb','EftcGcVcH8koWRpdIsdcPSk7','WPPXcL8','WPVdS8oECf7cGfD9WPFdMWWzdG','BtFdM8oMBCoWW58UBG','w0ldHmo4','mtuZCxb1ufDP','C2nHBgvz','DhjPBq','WPVdUCotwLpcM1XZWPxdHqiEf3S','WQu+WQVcNmooawO','i0P6D2qTy2fUDMfZlwfUAw1HDgLVBI1WyxjLBNqTzgL2','zgvMyxvSDfzHBhvL','5yIG6zMK5AsX6lsL77YbpgjYlZ7PLjNOR6/KV6hMGA/VVjO','6kEM5y+r5PE25PY6','WO1QW4SG','bd5xxJ1FW5ldTCo7W4pdRZ/dMc8','ebJcSZ/dKq','CMfUza','iuxdNCovA3VcIKe','yJddH8oMA8oDW7mx','WOOOBW','WRa5hfZdKmkmfafqWP5Hw8kAFv3dTX3cPw7cHXFcMsxdMmkub8kQfG','lJVcSqC','W6SDEwO0','gHxdNmkRWQORzqRcKs7dMKqOumkDmW','BuVcOZRcM8kdWP7dHG','57It5P265l+q57Yl','CeRcNIVcM8kIWQtdRau','hqpcUdtdPmkBWOLd','CxvLDwvnzxnZywDLrxjYB3i','5Qcp5B+F5y6R5AAT6lED77+t','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBv9Uyw1L','6k+35Qoa5P+L6AQO6AQ85zcn56EW5A+55BQu55Qe5PAh5lU25PIV5zcM5A2y5zYO77Yb77Yb','yw5PBwf0Aw9UtwvUDq','aKBdLfldScS','CxLFyw5PBwf0Aw9Ux2rPywXVz19PDgvTx2nVBNrLBNrFywn0AxzL','ab/cSYtdLCkVWPXvW6/cRSoRW7NcSmkXW7CsWQy','mXNdU1C3rZL9m03dVb8vW54qW5C','WPZcPxbvB8kUW5qGaG','WQjhWRxdRYBdRa','CxvLCNLtzwXLy3rVCG','kqRdIwFdVCo9rSork8kGW5HQWPVcSIu/','AxnkC29U','WPZdSSofwf7cL1y','WONdUmowB1ZcNa','W6P1r8kxWRHCgCkUW6XZWRH9WO0','5yUV5BQM5PEt55Mk','Dhj1zq','gCk4vZm5gapcSci','z2vUzxjHDg9Yvvvjra','nSojW6zWvfldIWBcNKjiAq','W68Xn2BdGSklbWL+WPPTwG','AuPCW6DpxWTNW4pdGgVdRv1hW5TydmoKeWeHW6TTmrLdWPz3l8k9W6zksq','WO1XdG','WPP9ffD1na','55QU6ikK5OYh56s657Q/','lNf5x2fUAw1HDgLVBL9JDxn0B20','phnWyw4Gy2XHC3m9zMLYzxrLEhq+5ywZ6zETpc9ZCgfUpG','WPBdSSoyBq','AxnqBgf5zxjdyxjK','5PIV5zcM5B6Q546V','WROKW7JcJCo0bGa','W6aTW53dNSkVC1iF','rSkDWOpcISkxDgLDWOq','a37cH2xcHmoMtW','phpdKCoRWRuwCq','y2fSBa','WO0PFanRDu3cUW','cI7dGHioeuSN','gG/dGmk6WQ4X','WPiPdCkTkdJdSmkb','hmkUvJK9dHdcLczAkG','W7SuAgy','5lIn6ycp5PIo5BQM5lIn6io95Bcp5lQomo+8GE+8Gq','WRnaW7eaW7ddNa','y29UDgfPBNm','qSo8vCkDWOxdMG','uSkGW43dUCkwWQ0WWP3cLaSg','C2vHCMnO','zNvUy3rPB24','5PAW5AkE54M55Pwi','WRnrW6qjW7y','gIldJa','y2JdJConCmo4fh8DWPFdSCk1WPHmna','tMdcKhhcNmo7tCkNlmkIWRq','WRRcMtmiWPL7W5tdJJLqsaKhW4ldHCk9WRCdW54N','zgf0yq','CgXHEwvYCW','CCoAcmkqW53dMmoEW6vjWPfgAX7dGKudEIjs','FmkZpCkDW43dJaiOWRTIW7hcLa','BNvT','WPJcRgu','tuxcPshdKCkmW4C','fG/cOHtdNSkdWPTkW7NcM8o+W7xcKSkKW6ap','ydddGW','kcGOlISPkYKRksSK','aLVdN1ddPtO','C3rVCfbYB3bHz2f0Aw9U','D8keo8k3sa/cJSk4WQ8','WOy5dSkHkJtdMmkdW5ZdJ8oWpmkPWPXzW43cKa','y2XVC2u','umk/W5pdQmkzWQaDWOy','aLVdNepdQcVcPCodsG','WPWMWQG','yxjLBMe','W6qZW5xdGmkCF00','BgfIzwXoB2rL','eCoUW5TMWQ7dUq','wEI9ToE8QEAuVG','ywrK','6k+p6lYM5ywE5Q6A56ko55IM5PwU5A6p77Y577+3','5QcH6AQm6zsz6k+V','d8oIW4v9WR3dSG','5BEG5yYo5RQj5yMW5P+d552I5PIt5AEq6yol6AoK','y2HLy2TIB3G','CMfUzg9TuMvTB3zL','zN3dJSoirq','C2v0u2nYB2XS','W4aKv0fMiCknba','CxvLDwvnzxnZywDLsw5MBW','WPq9WRrOWPy','bfRdKfhdQcVcHCouugJdKCkSW78','y2HHBMDL','zgL2','o28VW51o','5OYh56s657Q/57g75z6l','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBv9IDxr0B25Fy29UDgfPBMvY','C2TPBgW','DhjPz2DLCG','zw5K','zgvMyxvSDfnLBgvJDgvK','CxLnzxnZywDL','CMvTB3zLqxr0CMLIDxrL','5yMb6zMq5AAa6lsw776i5Bgt6kYe6ywR5zcw5P+Q5569W6NVVPC','WRC0pCooW7mxrCkkW7j5WRDEWOZcTum','WQvEWQNdTZO','ywNdH8oirCohhNWpWPhdT8kKWRrrkgHu','pCoAW7L6','5yIB5BU65OIq5yQF','AgLKzq','5Ps25Bc+5PE26zE0','mbddMNddTSo6sSoqkW','mmojW7f+uNO','CgfYzw50rwXLBwvUDa','WQrZWONcLmonlNGpWPm6nrm','yCobbmkiW5NdOCosW7LuWRLvAYa','5PYz55UK5zkU5zkW56Eq55Io5PE85lU55lU677+85lQQ5lMh6zUd5Q2b6kEC55Ur5PAH5lQE77696k6c6lEJ5lMX5lMC5Pwl55Mw5zk056Aj','6AQO6AQ85yQO55s7','W6TkWRVdMbpdTqWd','y3jLyxrL','lNf5x2fUAw1HDgLVBL9KAwfSB2DFAxrLBq','tu9wrq','lNf5x2fUAw1HDgLVBL9KAwfSB2DFywrKx2j1DhrVBG','DhLWzq','W5f8hejZk8kq','uSoPWOxdNWxdImory8on','kgtdQCoWWRiwsX5gW6K','y2XHC3nmAxn0','CxLWCM9TChq','yxbWzw5Kq2HPBgq','WPFdSSovDfpcKqO8W4W','WRXVF8kHEWjx','BgLUzvr5Cgu','smoXWQ/dNbVdTSoDBSoCWRpcKbi2h34','5B6i5AES5lYq57+Q','dmo+W6v3WRJdPmkKW4lcKa','WPi1d8k6osm','C3bLzwq','s8keWO/cM8kbsG','Af3cPYhcM8kbWPxdKWxcPCk+WRZdIKxdMapcPW','mrhdGNddTSoMD8oWaG','zw5HyMXLvhjPz2DLCG','CxvLDwvnzxnZywDLv2fYBG','WOjWavtcNtSGWOK','WPO4Aqu','zM9YrwfJAa','WOCYva9IFK7cPG','WOZdVmoBAfO','C2nHBgvy','5PEC5Aob54MD5Pwz5yMm57gk','pxtdKW','WRlcHKDJ','u8oNWOhdNb/dOCo5F8oAWPZcNa','eSoPW4n3WRldS8kQW5lcMW','DxbKyxrL'];a0_0x5969=function(){return _0x35027c;};return a0_0x5969();}const a0_0xfdda04=(function(){let _0x263aab=!![];return function(_0x13515c,_0x1ab2ab){const _0x10a989=_0x263aab?function(){const _0x3243d1=a0_0x24f8;if(_0x1ab2ab){const _0xf15a2a=_0x1ab2ab[_0x3243d1(0x29c,'NZRQ')](_0x13515c,arguments);return _0x1ab2ab=null,_0xf15a2a;}}:function(){};return _0x263aab=![],_0x10a989;};}()),a0_0x30818b=a0_0xfdda04(this,function(){const a0_0x34b25c={_0x8cdfc4:0x263,_0x68c1b0:0x241,_0x550f91:'LbN%'},_0x85c3b8=a0_0x24f8,_0x35ff99=a0_0x5688;return a0_0x30818b['toString']()[_0x35ff99(a0_0x34b25c._0x8cdfc4)](_0x35ff99(0x274))['toString']()[_0x85c3b8(0x269,'Q2hU')](a0_0x30818b)[_0x85c3b8(a0_0x34b25c._0x68c1b0,a0_0x34b25c._0x550f91)]('(((.+)+)+)+$');});function a0_0x5688(_0x1ebe57,_0x36a590){const _0x2dead4=a0_0x5969();return a0_0x5688=function(_0x8ba220,_0x4b081f){_0x8ba220=_0x8ba220-0xec;let _0x596926=_0x2dead4[_0x8ba220];if(a0_0x5688['ALtEPA']===undefined){var _0x24f84e=function(_0x45b018){const _0x3f26fe='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x2c1e16='',_0x568809='',_0xb3bdc3=_0x2c1e16+_0x24f84e;for(let _0x3ecc18=0x0,_0x276fcf,_0x467820,_0x1e4296=0x0;_0x467820=_0x45b018['charAt'](_0x1e4296++);~_0x467820&&(_0x276fcf=_0x3ecc18%0x4?_0x276fcf*0x40+_0x467820:_0x467820,_0x3ecc18++%0x4)?_0x2c1e16+=_0xb3bdc3['charCodeAt'](_0x1e4296+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x276fcf>>(-0x2*_0x3ecc18&0x6)):_0x3ecc18:0x0){_0x467820=_0x3f26fe['indexOf'](_0x467820);}for(let _0x5c8b26=0x0,_0x3dafb7=_0x2c1e16['length'];_0x5c8b26<_0x3dafb7;_0x5c8b26++){_0x568809+='%'+('00'+_0x2c1e16['charCodeAt'](_0x5c8b26)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x568809);};a0_0x5688['FhoXDW']=_0x24f84e,_0x1ebe57=arguments,a0_0x5688['ALtEPA']=!![];}const _0x39a659=_0x2dead4[0x0],_0x5eaa2a=_0x8ba220+_0x39a659,_0x484d9a=_0x1ebe57[_0x5eaa2a];if(!_0x484d9a){const _0x1cf14f=function(_0xccf1f7){this['WzaxEK']=_0xccf1f7,this['NpDXWR']=[0x1,0x0,0x0],this['DaUpdN']=function(){return'newState';},this['qKsjGr']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['RvqDYB']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x1cf14f['prototype']['IIBbVY']=function(){const _0x1f269f=new RegExp(this['qKsjGr']+this['RvqDYB']),_0x4275ee=_0x1f269f['test'](this['DaUpdN']['toString']())?--this['NpDXWR'][0x1]:--this['NpDXWR'][0x0];return this['vJVqfi'](_0x4275ee);},_0x1cf14f['prototype']['vJVqfi']=function(_0x19a937){if(!Boolean(~_0x19a937))return _0x19a937;return this['jkDaIv'](this['WzaxEK']);},_0x1cf14f['prototype']['jkDaIv']=function(_0xdc811e){for(let _0x25cbc6=0x0,_0x48b72c=this['NpDXWR']['length'];_0x25cbc6<_0x48b72c;_0x25cbc6++){this['NpDXWR']['push'](Math['round'](Math['random']())),_0x48b72c=this['NpDXWR']['length'];}return _0xdc811e(this['NpDXWR'][0x0]);},new _0x1cf14f(a0_0x5688)['IIBbVY'](),_0x596926=a0_0x5688['FhoXDW'](_0x596926),_0x1ebe57[_0x5eaa2a]=_0x596926;}else _0x596926=_0x484d9a;return _0x596926;},a0_0x5688(_0x1ebe57,_0x36a590);}a0_0x30818b(),lib['qyOpenLineEditor']=function(_0xc72e73={}){const a0_0x23c9d7={_0x549d3f:0x290,_0x37a7e7:0x22a,_0x4be796:'n9yy',_0x5c5e3b:0x1a1,_0x1cc873:'LbN%',_0x3bef37:'Z76A',_0x4c5dc6:0x2a3,_0x24a8cd:'65ei',_0x8c10f0:0x182,_0x1cdcd3:'VKYm',_0x8a9dee:0x2aa,_0x45ad38:0x10a,_0x462a13:'D!tV',_0x2ff896:'KxSm',_0x5f3983:'(op^',_0x4829c0:0xee,_0x406adf:0x28a,_0x4b7ba2:0x14a,_0x598763:'S$lo',_0x4b9c8d:0x188,_0x3469e3:'qJhQ',_0x2aeee4:0xf6,_0x428151:'LbN%'},a0_0x29faf1={_0xc46c35:0x1a9,_0x5cc718:0xec,_0x267d5f:0x2aa,_0x29c331:0x234,_0x296ef8:'KTEw',_0x21157c:0x209,_0x24072b:0x2aa,_0x2590af:0x290,_0x487743:0x1a0,_0x4ca835:0x237,_0xb487ee:0x293,_0x477a8a:0x138,_0x5674eb:0x170,_0x1e6e5c:0x2aa,_0x4ca306:0x273,_0x14906e:'BZNO',_0xdf5eb8:0x1bb,_0x49913a:0x117,_0x2c54e4:0x1a2,_0x34fafa:'ndiI',_0x3402da:0x1e6,_0xf82017:'p9@u',_0x1e2a00:0x195,_0x102147:'b#7x',_0x586749:0x1af},a0_0x580b5f={_0x362e8f:0x16a,_0x3c2639:'N2t4',_0x5b3dca:'mRff',_0x9a1608:0x1dd},a0_0x2482f6={_0x5ef5dc:0x160,_0x199cd3:0x23e,_0x4439e7:')mFV',_0x4d8ac1:0x1d0,_0x5d790c:'NZRQ',_0x53b84d:0x105},_0xbd070a=a0_0x24f8,_0x2bf1e6=a0_0x5688;let {buttonList:buttonList=[],initMenuContent:initMenuContent=function(_0x32d38e,_0x2625a4,_0x1c9036){},onLoad:onLoad=function(_0xc0f757,_0x546d47){},initItemMenuName:initItemMenuName=function(_0x1a611f){},initAddButton:initAddButton=function(_0x5af26e,_0x56c6bc){},dialogClose:dialogClose=function(_0x2099d7,_0x3f0357){}}=_0xc72e73;const _0x37511f=ui[_0x2bf1e6(0x2aa)][_0x2bf1e6(a0_0x23c9d7._0x549d3f)]('.qy_animation_dialog');_0x37511f[_0x2bf1e6(0x1aa)]=ui[_0x2bf1e6(0x2aa)]['div'](_0xbd070a(a0_0x23c9d7._0x37a7e7,a0_0x23c9d7._0x4be796),_0x37511f);const _0x518372=ui['create'][_0x2bf1e6(a0_0x23c9d7._0x549d3f)](_0xbd070a(a0_0x23c9d7._0x5c5e3b,a0_0x23c9d7._0x1cc873),_0x37511f['content']),_0x4ae6bc=ui[_0x2bf1e6(0x2aa)][_0xbd070a(0x15e,a0_0x23c9d7._0x3bef37)](_0x2bf1e6(0x10f),_0x518372);function _0x168b69(){const a0_0x280e49={_0x58c55d:0x141,_0x2370f9:0x25c,_0x8cd5f8:'GWkM',_0x21643c:0x204,_0x13d80b:'(op^',_0xda61e:0x1a8,_0x2ec014:0x1cb,_0x59e34a:0x1e0,_0xfd6036:0x151},_0x1d4e26=_0xbd070a,_0x10848c=_0x2bf1e6,_0x52de0d=Array[_0x10848c(a0_0x2482f6._0x5ef5dc)](_0x37511f['content'][_0x1d4e26(a0_0x2482f6._0x199cd3,a0_0x2482f6._0x4439e7)](_0x1d4e26(a0_0x2482f6._0x4d8ac1,a0_0x2482f6._0x5d790c)));_0x52de0d[_0x10848c(a0_0x2482f6._0x53b84d)](_0x3c44b4=>{const _0x2adee8=_0x1d4e26,_0x17f144=_0x10848c,{animationItem:_0x4f0590}=_0x3c44b4,{label:_0x92247a,name:_0x4b87fe}=_0x4f0590,_0x6f78c0=_0x4ae6bc['value']['toLowerCase'](),_0x38a0ec=_0x6f78c0[_0x17f144(a0_0x280e49._0x58c55d)]('\x20');let _0x731b2f=0x0;for(const _0x1fc1de of _0x38a0ec){(_0x92247a[_0x2adee8(a0_0x280e49._0x2370f9,a0_0x280e49._0x8cd5f8)]()[_0x2adee8(a0_0x280e49._0x21643c,a0_0x280e49._0x13d80b)](_0x1fc1de)||_0x4b87fe[_0x17f144(a0_0x280e49._0xda61e)]()['includes'](_0x1fc1de))&&_0x731b2f++;}_0x731b2f>0x0?_0x3c44b4[_0x17f144(a0_0x280e49._0x2ec014)][_0x17f144(a0_0x280e49._0x59e34a)]='block':_0x3c44b4[_0x17f144(0x1cb)]['display']=_0x2adee8(a0_0x280e49._0xfd6036,'T&ai');});}const _0xabd9dd=lib[_0x2bf1e6(0x137)]['debounce'](_0x168b69,0x1f4);_0x4ae6bc[_0xbd070a(0x10d,'6U4@')]=_0x3572c7=>{_0x3572c7['stopPropagation'](),_0xabd9dd(_0x3572c7);},ui[_0xbd070a(a0_0x23c9d7._0x4c5dc6,a0_0x23c9d7._0x24a8cd)][_0xbd070a(a0_0x23c9d7._0x8c10f0,a0_0x23c9d7._0x1cdcd3)]('button','搜索',_0x518372,_0x168b69),_0x37511f['close']=function _0x509db2(_0x153ff1){const _0x4b55ba=_0x2bf1e6,_0x1ed18d=_0xbd070a;_0x153ff1?.[_0x1ed18d(a0_0x580b5f._0x362e8f,a0_0x580b5f._0x3c2639)](),_0x4fff19[_0x1ed18d(0x1be,a0_0x580b5f._0x5b3dca)](0x1f4),_0x37511f[_0x4b55ba(a0_0x580b5f._0x9a1608)](),dialogClose(_0x4fff19,_0x37511f);};const _0x4fff19=ui[_0x2bf1e6(a0_0x23c9d7._0x8a9dee)][_0xbd070a(a0_0x23c9d7._0x45ad38,a0_0x23c9d7._0x462a13)]('.qy_animation_dialog_container',ui[_0xbd070a(0x16e,a0_0x23c9d7._0x2ff896)],_0x37511f[_0xbd070a(0x189,a0_0x23c9d7._0x5f3983)]);_0x4fff19['appendChild'](_0x37511f);const _0x381f7c=function(_0x1bd4f1){const a0_0x52c9b5={_0x448c7f:0x14b,_0x40b34c:0x157,_0x21159c:'&(Kb',_0x32edd1:0x2a6,_0x5b4697:'l^^j',_0x34a81e:'D!tV',_0x46b674:0x25b,_0x49dfeb:0x14d,_0x3d846b:'%V)('},_0x33bc8c=_0x2bf1e6,_0x25f7e2=_0xbd070a,{label:label='',onclick:onclick=function(_0x49d472){}}=initItemMenuName(_0x1bd4f1)??{},_0x24a2f6=ui[_0x25f7e2(a0_0x29faf1._0xc46c35,'%V)(')]['div'](_0x33bc8c(a0_0x29faf1._0x5cc718)),_0x2057cf=ui[_0x33bc8c(a0_0x29faf1._0x267d5f)][_0x33bc8c(0x290)](_0x33bc8c(0x119),_0x24a2f6),_0x1e02eb=ui['create']['div'](_0x33bc8c(a0_0x29faf1._0x29c331),_0x2057cf,label,onclick),_0x5305c6=ui[_0x33bc8c(a0_0x29faf1._0x267d5f)][_0x25f7e2(0x24a,a0_0x29faf1._0x296ef8)](_0x33bc8c(a0_0x29faf1._0x21157c),_0x24a2f6),_0x3ca493=ui[_0x33bc8c(a0_0x29faf1._0x24072b)][_0x33bc8c(a0_0x29faf1._0x2590af)](_0x33bc8c(a0_0x29faf1._0x487743),_0x5305c6),_0x30f9d0=ui[_0x25f7e2(a0_0x29faf1._0x4ca835,'*3yg')]['div']('.qy_animation_dialog_item_content',_0x3ca493);initMenuContent(_0x37511f,_0x30f9d0,_0x1bd4f1);const _0x2d2bb5=ui[_0x33bc8c(a0_0x29faf1._0x267d5f)][_0x33bc8c(0x290)](_0x33bc8c(a0_0x29faf1._0xb487ee),_0x5305c6);for(let _0x138d80 of buttonList){const _0x3fc889=_0x138d80[_0x33bc8c(a0_0x29faf1._0x477a8a)],_0x3f6360=_0x138d80[_0x33bc8c(a0_0x29faf1._0x5674eb)],_0x3665e0=ui[_0x33bc8c(a0_0x29faf1._0x1e6e5c)][_0x25f7e2(a0_0x29faf1._0x4ca306,a0_0x29faf1._0x14906e)]('.qy_animation_button',_0x3fc889,_0x2d2bb5);_0x3665e0[_0x33bc8c(a0_0x29faf1._0xdf5eb8)](_0x25f7e2(a0_0x29faf1._0x49913a,'@9sp'),function(_0x2e2848){const _0x135ee0=_0x25f7e2;_0x2e2848[_0x135ee0(a0_0x52c9b5._0x448c7f,'aTcF')]();const _0x52ef27={};_0x52ef27[_0x135ee0(a0_0x52c9b5._0x40b34c,a0_0x52c9b5._0x21159c)]=_0x2e2848,_0x52ef27[_0x135ee0(a0_0x52c9b5._0x32edd1,a0_0x52c9b5._0x5b4697)]=_0x1bd4f1,_0x52ef27['dialog']=_0x37511f,_0x52ef27[_0x135ee0(0x129,'@9sp')]=_0x24a2f6,_0x52ef27[_0x135ee0(0x126,a0_0x52c9b5._0x34a81e)]=_0x381f7c,typeof _0x3f6360===_0x135ee0(a0_0x52c9b5._0x46b674,'Z76A')&&_0x3f6360[_0x135ee0(a0_0x52c9b5._0x49dfeb,a0_0x52c9b5._0x3d846b)](this,_0x52ef27);});}if(_0x1bd4f1[_0x25f7e2(a0_0x29faf1._0x2c54e4,a0_0x29faf1._0x34fafa)]){const _0x19effd={..._0x1bd4f1[_0x25f7e2(a0_0x29faf1._0x3402da,a0_0x29faf1._0xf82017)]};_0x24a2f6[_0x25f7e2(a0_0x29faf1._0x1e2a00,a0_0x29faf1._0x102147)]=_0x19effd;}else{const _0x50a8e0={..._0x1bd4f1};_0x24a2f6[_0x33bc8c(a0_0x29faf1._0x586749)]=_0x50a8e0;}return _0x24a2f6;};return onLoad(_0x37511f,_0x381f7c),initAddButton(_0x37511f,_0x381f7c,ui[_0x2bf1e6(a0_0x23c9d7._0x8a9dee)][_0x2bf1e6(0x290)](_0x2bf1e6(a0_0x23c9d7._0x4829c0))),lib[_0x2bf1e6(a0_0x23c9d7._0x406adf)](_0x37511f),ui[_0xbd070a(a0_0x23c9d7._0x4b7ba2,a0_0x23c9d7._0x598763)]['appendChild'](_0x37511f),_0x37511f[_0xbd070a(a0_0x23c9d7._0x4b9c8d,a0_0x23c9d7._0x3469e3)]['type']=_0xc72e73[_0x2bf1e6(0x1b8)],_0x37511f['dataset'][_0xbd070a(0x22c,a0_0x23c9d7._0x5f3983)]=lib['qyUtils'][_0xbd070a(0x13e,'b#7x')](_0xbd070a(0x1e7,a0_0x23c9d7._0x462a13),_0xbd070a(a0_0x23c9d7._0x2aeee4,a0_0x23c9d7._0x428151)),_0x37511f;};function a0_0x24f8(_0x1ebe57,_0x36a590){const _0x2dead4=a0_0x5969();return a0_0x24f8=function(_0x8ba220,_0x4b081f){_0x8ba220=_0x8ba220-0xec;let _0x596926=_0x2dead4[_0x8ba220];if(a0_0x24f8['OEafuE']===undefined){var _0x24f84e=function(_0x3f26fe){const _0x2c1e16='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x568809='',_0xb3bdc3='',_0x3ecc18=_0x568809+_0x24f84e;for(let _0x276fcf=0x0,_0x467820,_0x1e4296,_0x5c8b26=0x0;_0x1e4296=_0x3f26fe['charAt'](_0x5c8b26++);~_0x1e4296&&(_0x467820=_0x276fcf%0x4?_0x467820*0x40+_0x1e4296:_0x1e4296,_0x276fcf++%0x4)?_0x568809+=_0x3ecc18['charCodeAt'](_0x5c8b26+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x467820>>(-0x2*_0x276fcf&0x6)):_0x276fcf:0x0){_0x1e4296=_0x2c1e16['indexOf'](_0x1e4296);}for(let _0x3dafb7=0x0,_0x1cf14f=_0x568809['length'];_0x3dafb7<_0x1cf14f;_0x3dafb7++){_0xb3bdc3+='%'+('00'+_0x568809['charCodeAt'](_0x3dafb7)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xb3bdc3);};const _0x45b018=function(_0xccf1f7,_0x1f269f){let _0x4275ee=[],_0x19a937=0x0,_0xdc811e,_0x25cbc6='';_0xccf1f7=_0x24f84e(_0xccf1f7);let _0x48b72c;for(_0x48b72c=0x0;_0x48b72c<0x100;_0x48b72c++){_0x4275ee[_0x48b72c]=_0x48b72c;}for(_0x48b72c=0x0;_0x48b72c<0x100;_0x48b72c++){_0x19a937=(_0x19a937+_0x4275ee[_0x48b72c]+_0x1f269f['charCodeAt'](_0x48b72c%_0x1f269f['length']))%0x100,_0xdc811e=_0x4275ee[_0x48b72c],_0x4275ee[_0x48b72c]=_0x4275ee[_0x19a937],_0x4275ee[_0x19a937]=_0xdc811e;}_0x48b72c=0x0,_0x19a937=0x0;for(let _0x491c5d=0x0;_0x491c5d<_0xccf1f7['length'];_0x491c5d++){_0x48b72c=(_0x48b72c+0x1)%0x100,_0x19a937=(_0x19a937+_0x4275ee[_0x48b72c])%0x100,_0xdc811e=_0x4275ee[_0x48b72c],_0x4275ee[_0x48b72c]=_0x4275ee[_0x19a937],_0x4275ee[_0x19a937]=_0xdc811e,_0x25cbc6+=String['fromCharCode'](_0xccf1f7['charCodeAt'](_0x491c5d)^_0x4275ee[(_0x4275ee[_0x48b72c]+_0x4275ee[_0x19a937])%0x100]);}return _0x25cbc6;};a0_0x24f8['BriFRP']=_0x45b018,_0x1ebe57=arguments,a0_0x24f8['OEafuE']=!![];}const _0x39a659=_0x2dead4[0x0],_0x5eaa2a=_0x8ba220+_0x39a659,_0x484d9a=_0x1ebe57[_0x5eaa2a];if(!_0x484d9a){if(a0_0x24f8['DXhbDG']===undefined){const _0xbd60fc=function(_0x363342){this['ZDslug']=_0x363342,this['iobtUb']=[0x1,0x0,0x0],this['zznQTQ']=function(){return'newState';},this['oVyqFH']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['xKgRIP']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xbd60fc['prototype']['tfYsOh']=function(){const _0x2c5afb=new RegExp(this['oVyqFH']+this['xKgRIP']),_0x5bf2e0=_0x2c5afb['test'](this['zznQTQ']['toString']())?--this['iobtUb'][0x1]:--this['iobtUb'][0x0];return this['hOyieY'](_0x5bf2e0);},_0xbd60fc['prototype']['hOyieY']=function(_0x2d0a){if(!Boolean(~_0x2d0a))return _0x2d0a;return this['ouZUVq'](this['ZDslug']);},_0xbd60fc['prototype']['ouZUVq']=function(_0x3ce553){for(let _0x5c5a23=0x0,_0x42774d=this['iobtUb']['length'];_0x5c5a23<_0x42774d;_0x5c5a23++){this['iobtUb']['push'](Math['round'](Math['random']())),_0x42774d=this['iobtUb']['length'];}return _0x3ce553(this['iobtUb'][0x0]);},new _0xbd60fc(a0_0x24f8)['tfYsOh'](),a0_0x24f8['DXhbDG']=!![];}_0x596926=a0_0x24f8['BriFRP'](_0x596926,_0x4b081f),_0x1ebe57[_0x5eaa2a]=_0x596926;}else _0x596926=_0x484d9a;return _0x596926;},a0_0x24f8(_0x1ebe57,_0x36a590);}const a0_0x37db20=new Map(),a0_0x5dbc86=function(_0x52926c,..._0x506628){const a0_0x32c2da={_0x188853:'(op^',_0x42c227:0xf3},_0x572c17=a0_0x5688,_0xb9af75=a0_0x24f8;for(let _0x5d4087 of _0x506628){a0_0x37db20[_0xb9af75(0x1ee,a0_0x32c2da._0x188853)](_0x5d4087)?.[_0x572c17(a0_0x32c2da._0x42c227)]['toggle']('qy_hidden',!_0x52926c);}},a0_0x42bfd3={};a0_0x42bfd3['name']=a0_0x5e8451(0x27b,'*3yg'),a0_0x42bfd3['label']=a0_0x539d13(0x153),a0_0x42bfd3[a0_0x5e8451(0x19c,'&Uqg')]='[]',a0_0x42bfd3['nodeTag']=a0_0x5e8451(0x227,'S$lo'),a0_0x42bfd3[a0_0x539d13(0x18b)]=onLoadArrayFunc,a0_0x42bfd3['check']=checkArrayFunc;const a0_0x381130={};a0_0x381130['name']=a0_0x539d13(0x12c),a0_0x381130[a0_0x539d13(0x1a5)]=a0_0x5e8451(0x1c7,'^l1Q'),a0_0x381130[a0_0x5e8451(0x14c,'D!tV')]='[]',a0_0x381130[a0_0x539d13(0x167)]=a0_0x5e8451(0x13a,'qJhQ'),a0_0x381130[a0_0x539d13(0x18b)]=onLoadArrayFunc,a0_0x381130[a0_0x5e8451(0x169,'NZRQ')]=checkArrayFunc;const a0_0x4efe36={};a0_0x4efe36[a0_0x5e8451(0x1e5,'aTcF')]='configId',a0_0x4efe36['label']=a0_0x539d13(0x1a3),a0_0x4efe36[a0_0x5e8451(0xf7,'&Uqg')]=a0_0x5e8451(0x14e,'9r^2'),a0_0x4efe36[a0_0x5e8451(0x1ff,'65ei')]='';const a0_0x3dfe51=[{'name':'label','label':a0_0x539d13(0x198),'default':'','check'(_0x1293e4,_0x27e90d,_0x1a1e84){const a0_0x4a6486={_0x1a94d5:0x21c,_0x21cb9c:0x21c,_0x3c33e6:0x128,_0x1585f2:'D!tV'},_0x4f90ba=a0_0x5e8451,_0x1111f1=a0_0x539d13;return{'isOk':_0x1293e4?.[_0x1111f1(a0_0x4a6486._0x1a94d5)]&&_0x1293e4?.[_0x1111f1(a0_0x4a6486._0x21cb9c)](),'errorMessage':_0x4f90ba(a0_0x4a6486._0x3c33e6,a0_0x4a6486._0x1585f2)};}},{'name':'name','label':'骨骼名称','default':'','onchange':lib['qyUtils'][a0_0x5e8451(0x125,'n9yy')](function(_0x312e33,_0x32bcef,_0x202755){const a0_0x17f9e8={_0x1e7b53:0x223,_0x1dfbbb:0x121,_0x2a4d00:'^l1Q',_0x3cc8ba:0x1b3,_0x580e5a:0x16b,_0x5b065a:0x130,_0x4f725f:0x18b},_0x380ac8=a0_0x539d13,_0x169cd1=a0_0x5e8451;if(_0x202755[_0x169cd1(0x231,'b#7x')]!==qyLineType[_0x169cd1(a0_0x17f9e8._0x1e7b53,'mRff')])return;const _0xe2586d=document[_0x169cd1(a0_0x17f9e8._0x1dfbbb,a0_0x17f9e8._0x2a4d00)](_0x380ac8(a0_0x17f9e8._0x3cc8ba));if(!_0xe2586d)return;const {name:_0x489289}=_0x202755;if(_0x489289===_0x32bcef)return;_0x202755[_0x169cd1(a0_0x17f9e8._0x580e5a,'aw2#')]=_0x32bcef,a0_0x3dfe51[_0x380ac8(a0_0x17f9e8._0x5b065a)](({name:_0x1665ec})=>_0x1665ec==='action')?.[_0x380ac8(a0_0x17f9e8._0x4f725f)](_0xe2586d,_0x202755);},0x3e8),'check'(_0x11be24,_0x30cc4d,_0x54285c){const a0_0x2c58da={_0x105ad5:0x111,_0x4892ed:'6U4@',_0x519ff3:0x187,_0x5be85d:'ndiI',_0x5c2280:0x219,_0x136c19:')z%3'},_0x2e5810=a0_0x5e8451,_0x3ba252=a0_0x539d13;if(_0x54285c[_0x3ba252(0xf8)]===qyLineType[_0x3ba252(0xed)]){const _0x3fb86e={};return _0x3fb86e[_0x2e5810(a0_0x2c58da._0x105ad5,a0_0x2c58da._0x4892ed)]=_0x30cc4d[_0x2e5810(a0_0x2c58da._0x519ff3,a0_0x2c58da._0x5be85d)]!=='默认',_0x3fb86e['errorMessage']=_0x3ba252(0x235),_0x3fb86e;}const _0x566bc5={};return _0x566bc5[_0x2e5810(a0_0x2c58da._0x5c2280,a0_0x2c58da._0x136c19)]=!![],_0x566bc5;}},{'name':a0_0x5e8451(0x18d,'Pfv5'),'label':a0_0x539d13(0x2a8),'nodeTag':a0_0x5e8451(0x194,'j3BS'),'onLoad'(_0x4e38ca,{name:_0x1f2766,isJson:_0x2da1c8,lineType:_0x4415b4}){const a0_0xf15a79={_0x5206e7:0xed,_0x447f7b:0x17c,_0x211ae3:0x1b6,_0x5bcfd5:0x23f,_0x2d2567:'j3BS'},a0_0x32f919={_0x545e7d:0x239,_0x288ef4:'b#7x',_0x1610ce:'RsQH'},a0_0x3fcf65={_0x51746c:0x100,_0x4778ff:')mFV',_0x39c623:0x11c},_0x41349a=a0_0x5e8451,_0x3db012=a0_0x539d13;if(parseFloat(_0x4415b4)!==qyLineType[_0x3db012(a0_0xf15a79._0x5206e7)])return;const _0x2019a8=function(_0x7e81d2){const _0x13a04d=_0x3db012,_0x1e9a14=a0_0x24f8;_0x4e38ca[_0x1e9a14(a0_0x3fcf65._0x51746c,a0_0x3fcf65._0x4778ff)]='';const _0x34cd83=_0x7e81d2[_0x13a04d(a0_0x3fcf65._0x39c623)]((_0x4c7aed,_0x15a655)=>new Option(_0x4c7aed,_0x4c7aed,_0x15a655===0x0,_0x4e38ca[_0x13a04d(0x220)]===_0x4c7aed));_0x34cd83[_0x1e9a14(0x240,'LbN%')](_0x2c617e=>_0x4e38ca[_0x13a04d(0xf5)](_0x2c617e));};if(!_0x1f2766){_0x2019a8(['默认']);return;}const _0x307dc1=globalThis[_0x3db012(a0_0xf15a79._0x447f7b)][_0x41349a(0x1ca,'n9yy')](),_0x278c36={};_0x278c36[_0x3db012(a0_0xf15a79._0x211ae3)]=_0x1f2766,_0x278c36['uuid']=_0x307dc1,_0x278c36[_0x3db012(a0_0xf15a79._0x5bcfd5)]=_0x2da1c8,lib[_0x41349a(0xff,a0_0xf15a79._0x2d2567)](_0x278c36,(_0x907e56,_0x388c00)=>{const _0x475ba6=_0x41349a;JzwdWebWorkerDestroySpine(_0x307dc1);if(_0x388c00)return _0x2019a8(['默认']),lib['qyMessage'][_0x475ba6(a0_0x32f919._0x545e7d,a0_0x32f919._0x288ef4)]('加载失败，请检查文件是否存在：'+_0x1f2766),console[_0x475ba6(0x28d,a0_0x32f919._0x1610ce)](_0x475ba6(0x143,'qJhQ')+_0x388c00);const {animationNameList:animationNameList=[]}=_0x907e56;_0x2019a8(animationNameList);});}},{'name':a0_0x539d13(0xf8),'label':a0_0x539d13(0x292),'nodeTag':a0_0x539d13(0x201),'nodeType':a0_0x5e8451(0x24b,'KTEw'),'default':qyLineType['MOVE'],'show':!![],'onLoad'(_0x2373ae){const a0_0x552fcb={_0x490bbd:0x214,_0x3b6006:'@9sp',_0x42ae3f:0x1d4,_0x13147f:'RsQH',_0x2449fc:0x124,_0x5e5e0f:0x199,_0x45caf2:0x138,_0x2b956f:'VKYm',_0x445822:0xed,_0x419b3c:0x12d,_0x5a0b82:0x289,_0x1609e5:0x123,_0x3419a4:'07Vf',_0x1a0421:0x1ba,_0x8ca78e:'tjX6'},a0_0x4ff0e3={_0x43c669:0x186,_0x1f2977:'qJhQ',_0x246afb:0x297,_0x7f7bc2:0x1d4,_0x580dde:'RsQH',_0xb53f94:0x1c1,_0x1efad5:'MxUw'},_0x608a52=a0_0x539d13,_0x291bfc=a0_0x5e8451;_0x2373ae[_0x291bfc(a0_0x552fcb._0x490bbd,a0_0x552fcb._0x3b6006)]=parseFloat(_0x2373ae[_0x291bfc(a0_0x552fcb._0x42ae3f,a0_0x552fcb._0x13147f)]);const _0x276186={};_0x276186['text']='拉伸',_0x276186[_0x608a52(a0_0x552fcb._0x2449fc)]=qyLineType[_0x608a52(a0_0x552fcb._0x5e5e0f)],_0x276186['defaultSelected']=![];const _0x4f290e={};_0x4f290e[_0x608a52(a0_0x552fcb._0x45caf2)]='移动',_0x4f290e[_0x291bfc(0x291,a0_0x552fcb._0x2b956f)]=qyLineType[_0x608a52(a0_0x552fcb._0x445822)],_0x4f290e['defaultSelected']=!![];const _0x5bb640={};_0x5bb640[_0x608a52(0x138)]=_0x608a52(a0_0x552fcb._0x419b3c),_0x5bb640[_0x291bfc(a0_0x552fcb._0x5a0b82,'RXil')]=qyLineType[_0x291bfc(a0_0x552fcb._0x1609e5,a0_0x552fcb._0x3419a4)],_0x5bb640['defaultSelected']=![];const _0x1fb248=[_0x276186,_0x4f290e,_0x5bb640],_0x9e49ca=_0x1fb248[_0x291bfc(a0_0x552fcb._0x1a0421,a0_0x552fcb._0x8ca78e)](({value:_0x1380fa,text:_0x14a2c0,defaultSelected:_0x41b505})=>({'text':_0x14a2c0,'value':_0x1380fa,'defaultSelected':_0x41b505}));_0x9e49ca['forEach'](_0x30ae8e=>{const _0x382cdd=_0x608a52,_0x2ca272=_0x291bfc,_0x5eb236=new Option(_0x30ae8e['text'],_0x30ae8e[_0x2ca272(a0_0x4ff0e3._0x43c669,a0_0x4ff0e3._0x1f2977)],_0x30ae8e[_0x382cdd(a0_0x4ff0e3._0x246afb)],_0x30ae8e[_0x2ca272(a0_0x4ff0e3._0x7f7bc2,a0_0x4ff0e3._0x580dde)]===parseFloat(_0x2373ae[_0x2ca272(a0_0x4ff0e3._0xb53f94,a0_0x4ff0e3._0x1efad5)]));_0x2373ae['appendChild'](_0x5eb236);});},'onchange'(_0x8bbad0,_0x2d189f,_0x3b7bfd){const a0_0x44b7d9={_0x299774:0xf1,_0x4edea3:'pJZr',_0x564b32:0x181,_0x89fb86:0x1a6,_0x3b1625:'K0&3',_0x4b1fa7:0x21e,_0xa687c2:'MxUw',_0x22f43d:0x130,_0x1b52f8:0x13d,_0x2ff0e9:0x150,_0x1751a5:0x1bf,_0x5a1acb:'&Uqg'},_0x146072=a0_0x539d13,_0x3bdf41=a0_0x5e8451;_0x3b7bfd['lineType']=parseFloat(_0x2d189f),a0_0x5dbc86(_0x3b7bfd['lineType']===qyLineType[_0x3bdf41(0x10b,'^l1Q')],'action','isJson',_0x146072(0xfd),_0x3bdf41(a0_0x44b7d9._0x299774,a0_0x44b7d9._0x4edea3),_0x146072(a0_0x44b7d9._0x564b32),'scakeX'),a0_0x5dbc86(_0x3b7bfd[_0x146072(0xf8)]!==qyLineType[_0x3bdf41(a0_0x44b7d9._0x89fb86,a0_0x44b7d9._0x3b1625)],_0x3bdf41(a0_0x44b7d9._0x4b1fa7,a0_0x44b7d9._0xa687c2)),a0_0x3dfe51[_0x146072(a0_0x44b7d9._0x22f43d)](({name:_0xe20180})=>_0xe20180===_0x146072(0x132))?.[_0x146072(a0_0x44b7d9._0x1b52f8)](a0_0x37db20[_0x146072(a0_0x44b7d9._0x2ff0e9)](_0x146072(0x132)),_0x3b7bfd,_0x3bdf41(a0_0x44b7d9._0x1751a5,a0_0x44b7d9._0x5a1acb));},'onMount'(_0xf7c73f,_0x56ce91,_0xb69b1e){const a0_0x2e0f24={_0x373e49:0x142,_0xeb7051:'nadX',_0x4211f3:0x103},_0x3ad954=a0_0x5e8451;a0_0x3dfe51['find'](({name:_0x1abfd4})=>_0x1abfd4==='lineType')?.[_0x3ad954(a0_0x2e0f24._0x373e49,a0_0x2e0f24._0xeb7051)]['call'](_0xf7c73f,null,_0x56ce91[_0xb69b1e]??qyLineType['MOVE'],_0x56ce91,_0x3ad954(a0_0x2e0f24._0x4211f3,'ndiI'));}},{'name':a0_0x539d13(0x101),'label':a0_0x539d13(0x1e2),'default':![],'show':!![],'onchange'(_0x4585fa,_0x3605ce,_0x52b23b){const a0_0x1e8cf7={_0x342940:0x28e,_0x25e296:'*3yg',_0x5339ed:0x252,_0xbce542:0x192,_0x5ca354:0x17b},_0x3b329=a0_0x539d13,_0x4a59ca=a0_0x5e8451;_0x52b23b['enableTrigger']=_0x3605ce,a0_0x5dbc86(_0x52b23b[_0x4a59ca(a0_0x1e8cf7._0x342940,a0_0x1e8cf7._0x25e296)]===!![],_0x4a59ca(a0_0x1e8cf7._0x5339ed,'aTcF'),_0x3b329(a0_0x1e8cf7._0xbce542),_0x3b329(a0_0x1e8cf7._0x5ca354));},'onMount'(_0x54764d,_0x19e2a2,_0x432dae){const a0_0x461971={_0x34fded:0x130,_0x2c0de1:0x11b,_0x2dacc5:0x257,_0x36cba8:0x11e,_0x2cb21d:'N2t4'},_0x148df2=a0_0x5e8451,_0x487a2f=a0_0x539d13;a0_0x3dfe51[_0x487a2f(a0_0x461971._0x34fded)](({name:_0x33c04a})=>_0x33c04a===_0x148df2(0x17a,'l^^j'))?.[_0x487a2f(a0_0x461971._0x2c0de1)][_0x487a2f(a0_0x461971._0x2dacc5)](_0x54764d,null,_0x19e2a2[_0x432dae]??![],_0x19e2a2,_0x148df2(a0_0x461971._0x36cba8,a0_0x461971._0x2cb21d));}},{'name':a0_0x5e8451(0x27e,'9r^2'),'label':a0_0x539d13(0x222),'default':'','onLoad'(_0x2e3762,_0x15ac71,_0x236c67){const a0_0x31a662={_0x5166d0:0x124,_0x545a0b:0x20e,_0x105676:'KxSm'},_0x2c14c3=a0_0x5e8451,_0x4c9bc8=a0_0x539d13;try{_0x2e3762[_0x4c9bc8(a0_0x31a662._0x5166d0)]=JSON[_0x2c14c3(a0_0x31a662._0x545a0b,a0_0x31a662._0x105676)](_0x15ac71[_0x236c67]||{});}catch(_0x320d22){}},'check'(_0x46c178,_0x108cb2,_0x4d4760){const a0_0x362b93={_0x506eaa:0x22e,_0x19c81f:'j3BS',_0x4fdaab:'KTEw',_0x42a127:0x114},_0x2bde00=a0_0x539d13,_0x1a85bc=a0_0x5e8451;let _0x37281d=!![],_0x563b15='';try{if(!_0x46c178)_0x46c178={};_0x46c178=eval('('+_0x46c178+')');}catch(_0x3b152d){_0x37281d=![],_0x563b15='格式化失败：'+_0x3b152d[_0x1a85bc(a0_0x362b93._0x506eaa,a0_0x362b93._0x19c81f)]();}const _0x5cd0b3={};return _0x5cd0b3[_0x2bde00(0x202)]=_0x37281d,_0x5cd0b3[_0x1a85bc(0x155,a0_0x362b93._0x4fdaab)]=_0x46c178,_0x5cd0b3[_0x2bde00(a0_0x362b93._0x42a127)]=_0x563b15,_0x5cd0b3;}},{'name':a0_0x5e8451(0x23c,'NZRQ'),'label':'过滤','default':'','nodeTag':a0_0x5e8451(0x259,'KxSm'),'check'(_0xe5ec1,_0x55c167,_0x457d21){const a0_0x3b2d05={_0x4e5e0f:0x264,_0x227963:0x1fa,_0x5baf62:0x14f,_0x3c4f95:'65ei'},_0x40b8fe=a0_0x5e8451,_0xa6b757=a0_0x539d13;let _0x298f5d=!![],_0x42c2fb='';try{if(_0xe5ec1){_0xe5ec1=eval('('+_0xe5ec1+')');if(typeof _0xe5ec1!==_0xa6b757(a0_0x3b2d05._0x4e5e0f))throw new IllegalArgumentError('这不是一个函数');}}catch(_0x243dff){_0x298f5d=![],_0x42c2fb=_0x40b8fe(0x233,'vMXq')+_0x243dff[_0xa6b757(a0_0x3b2d05._0x227963)]();}const _0x6a68ab={};return _0x6a68ab[_0x40b8fe(a0_0x3b2d05._0x5baf62,'*3yg')]=_0x298f5d,_0x6a68ab['data']=_0xe5ec1,_0x6a68ab[_0x40b8fe(0x247,a0_0x3b2d05._0x3c4f95)]=_0x42c2fb,_0x6a68ab;}},{'name':'startPosition','label':a0_0x5e8451(0xfa,'s*uQ'),'default':'','check'(_0x594b2d,_0x229e8d,_0x17199b){const a0_0x349c76={_0x18f450:0x21c},_0xe26e13=a0_0x539d13;return{'isOk':_0x594b2d?.[_0xe26e13(a0_0x349c76._0x18f450)]?.(),'errorMessage':'请输入开始位置'};}},{'name':a0_0x5e8451(0x1cf,'wGV3'),'label':a0_0x5e8451(0x22f,'mRff'),'default':'','check'(_0x42966,_0x3e13ff,_0x1bc839){const a0_0x23fdba={_0x276216:0x113,_0x60f623:'tjX6'},_0x20315c=a0_0x539d13,_0x57701e=a0_0x5e8451;return{'isOk':_0x42966?.[_0x57701e(a0_0x23fdba._0x276216,a0_0x23fdba._0x60f623)]?.(),'errorMessage':_0x20315c(0x127)};}},{'name':'skillLine','label':a0_0x539d13(0x24c),'default':![],'show':!![],'onchange'(_0x122b1d,_0x460fa3,_0xf85b72){const a0_0x2e7ff8={_0x4b57f9:'GWkM',_0x4e6a4b:0x1fb},_0x45c949=a0_0x539d13,_0x5247aa=a0_0x5e8451;_0xf85b72[_0x5247aa(0x1ec,a0_0x2e7ff8._0x4b57f9)]=_0x460fa3,a0_0x5dbc86(!_0x460fa3,_0x45c949(a0_0x2e7ff8._0x4e6a4b));},'onMount'(_0x240096,_0x501467,_0xb10226){const a0_0x2a2e65={_0x56d8b1:'Q2hU',_0x234274:0xf3,_0x4ea267:0x173},_0x531c85=a0_0x539d13,_0xcf2780=a0_0x5e8451;a0_0x3dfe51[_0xcf2780(0x191,a0_0x2a2e65._0x56d8b1)](({name:_0x4ddb92})=>_0x4ddb92===_0x531c85(0x132))?.['checkShow'](!_0x240096[_0x531c85(a0_0x2a2e65._0x234274)]['contains'](_0xcf2780(a0_0x2a2e65._0x4ea267,'MxUw'))&&!_0x501467[_0xb10226]);},'checkShow'(_0x5ac382){const a0_0x1a9dac={_0x54780f:0x1fb},_0x14dc2f=a0_0x539d13;a0_0x5dbc86(_0x5ac382,_0x14dc2f(a0_0x1a9dac._0x54780f));}},{'name':a0_0x539d13(0x1fb),'label':a0_0x539d13(0x251),'default':![],'onchange'(_0x19f2b6,_0x369a76,_0x2e5251){const a0_0x21c0f2={_0x5806d2:'LbN%'},_0xe5e6e0=a0_0x5e8451;_0x2e5251[_0xe5e6e0(0x24f,a0_0x21c0f2._0x5806d2)]=_0x369a76;}},{'name':a0_0x539d13(0x250),'label':'将牌区域','default':![],'show':!![],'onchange'(_0x421865,_0x31471a,_0x26a4de){_0x26a4de['isPlayerCard']=_0x31471a;}},{'name':a0_0x539d13(0x108),'label':'X轴缩放','default':0x1,'step':0.1,'show':!![],'check'(_0x15bc5c,_0x4df824,_0x32116b){const a0_0x30f718={_0x440eab:0x29b,_0x39faec:'K0&3',_0xc5dcb2:0x18c},_0x57b19f=a0_0x539d13,_0x3dbc0d=a0_0x5e8451;return{'isOk':qyAnimationUtil[_0x3dbc0d(a0_0x30f718._0x440eab,a0_0x30f718._0x39faec)](_0x15bc5c),'errorMessage':_0x57b19f(a0_0x30f718._0xc5dcb2)};}},{'name':'scaleY','label':a0_0x539d13(0x281),'default':0x1,'step':0.1,'show':!![],'check'(_0x25cc1d,_0x48558e,_0x5c24a3){const a0_0x53991b={_0x14f5a2:0x17e,_0x14e40d:0x18c},_0xd29c27=a0_0x539d13;return{'isOk':qyAnimationUtil[_0xd29c27(a0_0x53991b._0x14f5a2)](_0x25cc1d),'errorMessage':_0xd29c27(a0_0x53991b._0x14e40d)};}},{'name':a0_0x5e8451(0x253,'9r^2'),'label':'移动时间','default':0x3e8,'max':Infinity,'min':-Infinity,'step':0x64,'onLoad'(_0x792d3b,_0x4a83be){const a0_0x531b8d={_0x4820ee:0x1bd,_0x1adb99:0x124},_0x4d69d5=a0_0x539d13;_0x792d3b[_0x4d69d5(a0_0x531b8d._0x4820ee)]=_0x792d3b[_0x4d69d5(a0_0x531b8d._0x1adb99)];},'check'(_0x370279,_0x428afe,_0x950c38){const a0_0x128e40={_0x14cac1:0x18c},_0x22a441=a0_0x539d13;return{'isOk':qyAnimationUtil[_0x22a441(0x17e)](_0x370279),'errorMessage':_0x22a441(a0_0x128e40._0x14cac1)};}},{'name':'endTime','label':a0_0x539d13(0x2a1),'default':0x1f4,'max':Infinity,'min':-Infinity,'step':0x64,'onLoad'(_0x880eb5,_0x5b3c55){const a0_0x2bfaf5={_0x4c1305:'6U4@',_0xe01894:0x107,_0x2ee781:'LbN%'},_0x25d70e=a0_0x5e8451;_0x880eb5[_0x25d70e(0x159,a0_0x2bfaf5._0x4c1305)]=_0x880eb5[_0x25d70e(a0_0x2bfaf5._0xe01894,a0_0x2bfaf5._0x2ee781)];},'check'(_0x3d39ac,_0x472314,_0x2c59dc){const a0_0x14c0fe={_0x4b4ee1:0x1eb,_0x244c7c:0x206,_0x17cce6:'p9@u'},_0x297929=a0_0x5e8451;return{'isOk':qyAnimationUtil[_0x297929(a0_0x14c0fe._0x4b4ee1,'s*uQ')](_0x3d39ac),'errorMessage':_0x297929(a0_0x14c0fe._0x244c7c,a0_0x14c0fe._0x17cce6)};}},{'name':a0_0x5e8451(0x2a2,')mFV'),'label':'到目标后悬停','default':0x0,'max':Infinity,'min':-Infinity,'step':0x64,'onLoad'(_0x40ed1e,_0x5264bc){const a0_0x15ab98={_0xe51c82:0x164,_0x797bcd:'07Vf'},_0x4ffe42=a0_0x5e8451;_0x40ed1e[_0x4ffe42(a0_0x15ab98._0xe51c82,a0_0x15ab98._0x797bcd)]=_0x40ed1e['value'];},'check'(_0x34529a,_0x2831ae,_0x58bf69){const a0_0x482977={_0x56eca0:0x17e,_0x5174af:0x18c},_0x21e6c8=a0_0x539d13;return{'isOk':qyAnimationUtil[_0x21e6c8(a0_0x482977._0x56eca0)](_0x34529a),'errorMessage':_0x21e6c8(a0_0x482977._0x5174af)};}},{'name':'isJson','label':a0_0x5e8451(0x139,'2[1&'),'default':![],'onchange'(_0x1d5547,_0x32f390,_0x556b99){const a0_0x527bf1={_0x42bc9d:'GWkM'},_0x35d844=a0_0x5e8451;_0x556b99[_0x35d844(0x183,a0_0x527bf1._0x42bc9d)]=_0x32f390;}},{'name':a0_0x5e8451(0x1f2,'MxUw'),'label':'播放速度','default':0x1,'max':Infinity,'min':0x0,'step':0.1,'show':!![],'check'(_0x26a975,_0xd0e5f6,_0xc41720){const a0_0x303b65={_0x5be384:0x1b7,_0x3eedd6:'GWkM',_0x50904a:0x18c},_0xeda148=a0_0x539d13,_0x461cd6=a0_0x5e8451;return{'isOk':qyAnimationUtil[_0x461cd6(a0_0x303b65._0x5be384,a0_0x303b65._0x3eedd6)](_0x26a975),'errorMessage':_0xeda148(a0_0x303b65._0x50904a)};}},{'name':a0_0x5e8451(0x1fc,'@9sp'),'label':a0_0x539d13(0x1d8),'default':0x0,'max':Infinity,'min':0x0,'step':0x64,'check'(_0x533846,_0x1d688c,_0x1dccc5){const a0_0x56e874={_0x17a8ea:0x283,_0x3e51cc:'07Vf'},_0x2aff69=a0_0x5e8451;return{'isOk':qyAnimationUtil['isCorrectNumber'](_0x533846),'errorMessage':_0x2aff69(a0_0x56e874._0x17a8ea,a0_0x56e874._0x3e51cc)};}},{'name':a0_0x539d13(0x184),'label':a0_0x5e8451(0x1a4,'NZRQ'),'default':0x0,'max':0x168,'min':-0x168,'step':0x1,'check'(_0x2c1b4a,_0x11840d,_0x2c055f){const a0_0x46116c={_0x6d0fba:0x18c},_0x3ff5d8=a0_0x539d13;return{'isOk':qyAnimationUtil['isCorrectNumber'](_0x2c1b4a),'errorMessage':_0x3ff5d8(a0_0x46116c._0x6d0fba)};}},{'name':a0_0x539d13(0x20c),'label':a0_0x5e8451(0x1f1,'%V)('),'default':0x0,'max':0x3e7,'min':-0x3e7,'step':0x1,'onchange'(_0x350a85,_0x2125ff,_0x156e7d){const a0_0x9a08df={_0x2e2d86:0x261,_0x2f8668:'07Vf',_0x52b8da:0x22d,_0x49a052:'qJhQ'},_0x564319=a0_0x5e8451,_0x272370={};_0x272370[_0x564319(a0_0x9a08df._0x2e2d86,a0_0x9a08df._0x2f8668)]=_0x2125ff,_0x272370['uuid']=_status[_0x564319(a0_0x9a08df._0x52b8da,a0_0x9a08df._0x49a052)],lib['qyWorkerUpdateSpine'](_0x272370);},'check'(_0x5d45b5,_0x3b5404,_0x233a70){const a0_0x248076={_0x1b3f76:0xf9,_0x50f22d:'pJZr',_0x8ae1c1:0x18c},_0x550c93=a0_0x539d13,_0x1fe9a1=a0_0x5e8451;return{'isOk':qyAnimationUtil[_0x1fe9a1(a0_0x248076._0x1b3f76,a0_0x248076._0x50f22d)](_0x5d45b5),'errorMessage':_0x550c93(a0_0x248076._0x8ae1c1)};}},{'name':'is_lazy','label':'是否懒加载','default':![],'show':!![],'onchange'(_0xcbfd9e,_0x68d450,_0x2111c5,_0x474305){_0x2111c5[_0x474305]=_0x68d450;}},{'name':a0_0x539d13(0x175),'label':'不透明度','default':0x1,'max':0x1,'min':0x0,'step':0.1,'check'(_0xa63ed8,_0x1fb14f,_0x47cbce){const a0_0x48fba2={_0x1d0e02:0x1c5,_0x48907c:'b#7x',_0x3cf72b:0x114,_0x506247:0x25e},_0x26b4ed=a0_0x539d13,_0x3057c5=a0_0x5e8451;if(!qyAnimationUtil['isCorrectNumber'](_0xa63ed8)){const _0x3917b8={};return _0x3917b8['isOk']=![],_0x3917b8[_0x3057c5(a0_0x48fba2._0x1d0e02,a0_0x48fba2._0x48907c)]='请输入正确的数字！！',_0x3917b8;}if(_0xa63ed8>0x1){const _0x369b50={};return _0x369b50[_0x26b4ed(0x202)]=![],_0x369b50[_0x26b4ed(0x114)]='不透明度不能大于1！！',_0x369b50;}if(_0xa63ed8<0x0){const _0x21024d={};return _0x21024d['isOk']=![],_0x21024d[_0x26b4ed(a0_0x48fba2._0x3cf72b)]=_0x26b4ed(a0_0x48fba2._0x506247),_0x21024d;}}},a0_0x42bfd3,a0_0x381130,a0_0x4efe36],a0_0x165269=a0_0x3dfe51['map'](_0x4799ca=>_0x4799ca['name']),a0_0x3d3945=_0x3ca3af=>{const a0_0x64e67e={_0x14487d:0x152,_0x45fd55:0x19e,_0x441d62:0x21b},_0x1d928b=a0_0x539d13,{scale:_0x3165ea}=_0x3ca3af;_0x3ca3af[_0x1d928b(0x19e)](_0x1d928b(a0_0x64e67e._0x14487d))&&(delete _0x3ca3af['scale'],_0x3ca3af[_0x1d928b(a0_0x64e67e._0x45fd55)]('scaleX')===![]&&(_0x3ca3af['scaleX']=_0x3165ea),_0x3ca3af[_0x1d928b(a0_0x64e67e._0x45fd55)]('scaleY')===![]&&(_0x3ca3af[_0x1d928b(a0_0x64e67e._0x441d62)]=_0x3165ea));};lib['qyOpenLineConfigEditor']=function({animationList:animationList=[],onclose:onclose=function(){},qyLineItemUUID:_0x4c7b20}={}){const a0_0x242fbc={_0x3583f1:0x1c0},a0_0xc54035={_0x2f8148:0x180,_0x5ce7e5:'MxUw',_0x5d9506:0x2a4,_0x4bec39:0xf5},a0_0x30997d={_0x4f4d0d:0x135,_0x16237f:'aTcF',_0x36e552:0x275,_0xe0ef9d:0x1b0,_0x1eba6e:0x1ea,_0x1e2ac1:'6U4@',_0x43437e:0x22b,_0x5ce357:'F(Bl'},a0_0x410f03={_0x3cb3cc:0x147,_0x4c9683:'LbN%',_0x2c4798:0x1aa,_0x1a8a09:0xf5},a0_0x5597c7={_0x377b1b:0x254,_0x1e2fee:'@9sp',_0x48e37e:0xfc,_0x30df21:'Z76A',_0x1f8b0a:0x105},a0_0x2624a3={_0x2ede48:0x18a,_0x27ace3:0xf5,_0x3621e0:0x265,_0x4010d6:0x1ac},a0_0xa6bc03={_0x26c56a:0x20f,_0x5f39d2:'RsQH'},a0_0x1a229e={_0x319430:'KTEw'},a0_0x4f47f1={_0x133669:0x298,_0x74d656:0x28c,_0x1bdc5b:0x106,_0x2edb3d:0x286,_0xe269b:0x12a,_0x2e6383:0x2a0,_0x5c6158:0x2aa,_0x2ed185:0x1d9,_0x50f557:'LbN%',_0x1bf2a5:'K0&3',_0x4c7fba:'65ei',_0x5d3126:0x290,_0x442a13:0x131,_0x2ae83e:'j3BS',_0x59d0e7:0x19b,_0x41448e:0x1b1,_0x18145f:0x1bc,_0x184d41:'&Uqg',_0x3c70a6:0x267,_0x9fd46a:'KxSm',_0xf39031:0x24d,_0x1d4170:0x105,_0x4759c5:0x193,_0x15e7c5:'aTcF',_0x17132a:0x2aa,_0x1518c4:0x1f9,_0x4d3e0e:'N2t4',_0x55e567:0x255,_0xe9d118:'Q2hU',_0x3ec334:0x2aa,_0x1da5c1:0x243,_0x16a7f2:'Z76A',_0x55c11b:0x174,_0x35e7d5:0x20a,_0x47c144:0x15b},a0_0x49e686={_0x18dde9:'2[1&',_0x18b79d:0x172,_0x23f038:'mRff',_0x3d88bd:0x116,_0x225e53:'pJZr',_0x2912d7:0x1f5,_0xc118c:'pJZr',_0x8ed4e8:0x120},a0_0x308909={_0x2ebd1d:0x19e,_0x2cb27e:0x224,_0x33ee8c:'%V)(',_0x598f55:0x1d7,_0x3b000c:0x10e},a0_0x398c42={_0x81e566:0x26f,_0x196d54:0x1f0,_0x38e1c3:'D!tV',_0x1960e6:0x26c,_0x39aa25:'qJhQ',_0x3a4210:0x144,_0x4be451:0x26f,_0x45507b:0x226,_0x3b7364:0x27c,_0x58d5df:'RsQH',_0x3790fd:0x11f,_0x5ab7cb:0x19d,_0x455c7a:0x168,_0x398f2a:'65ei',_0xbf193d:0x20c,_0x34c459:'VKYm'},a0_0x322cbc={_0x4f3ec6:0x290,_0x535cac:0x10f,_0x3248ca:0x1e9,_0x2c9aff:'KTEw',_0x2afa39:'n9yy',_0xba3fc8:'KxSm',_0x20b7bd:'*3yg',_0x575a3b:0x246,_0x195ad5:0x16d,_0xa14f4e:'N2t4',_0x46ef22:0x1c6,_0x53af84:'VKYm',_0x6e6446:0x1fd,_0x4a3580:'@9sp',_0x44bbf4:0x248,_0x2d41f7:'n9yy',_0x5bbe93:0x134,_0x123b81:'VKYm',_0x29c80f:0x185,_0x505da9:'6U4@',_0x47764a:0x2aa,_0x151687:0x212,_0x33364e:0xf5,_0x31577a:0x213,_0x2056b3:0x16c,_0x14fc2b:0x104,_0x2de22c:0x287,_0x401b69:0x1ce,_0xcf05c6:')z%3',_0x41d3a9:0x1f6,_0x3ebfea:'Pfv5',_0x2e2aef:0x244,_0x46b9e8:0x124,_0x59b209:0x25f,_0x6ee868:'mRff',_0x302e9b:0x220,_0x587931:0x158},a0_0x55fda9={_0x424cf8:0x112,_0x52a67f:0x1c2,_0x5d6029:'b#7x'},a0_0x435bfa={_0xce4e48:0x258,_0x3734a7:'N2t4',_0xdbf433:0xf3,_0x4a7056:0x1dd,_0x4fad08:'BZNO',_0x16c0e9:0x282,_0x13454b:0x19a,_0x443655:0x230,_0x32e7f9:'j3BS',_0x54fae8:0x1d2,_0x5685f2:'T&ai',_0x4ba2ea:0x122,_0x24ab89:'l^^j',_0x3eff57:0x232,_0x3257e4:0x284},_0xefc30c=a0_0x5e8451,_0xe11285=function({animationItem:_0x4ea145,dialog:_0x4c5c8d,addItemMenu:_0x28006c,menuItemContainer:_0x407b73,onclose:onclose=function(){}}){const a0_0x107f65={_0x1147ab:0x16f,_0x530d5c:'F(Bl'},a0_0xccf8f5={_0x504e6e:0x1aa,_0x418d60:0x148,_0x124b15:'RXil',_0x317051:0x1ef},a0_0x202023={_0x3688db:0x29e,_0xd9531e:'65ei',_0xf71b54:0x26f,_0x222be7:0x288,_0x44519d:0x1ed,_0x5e7a48:0x296,_0x5c561d:0x1e1},a0_0x478f52={_0x359695:0x124},a0_0xe8ae8c={_0x3688b7:0xef,_0x208e64:0x15d,_0x265510:0x177,_0x2460c4:'KxSm'},a0_0x46f66b={_0x1bf48d:0x285,_0x4cb90b:'6U4@',_0x4fe8cf:0x1dd,_0x38bf4c:0x1de,_0x2d845b:0x23d,_0x246b05:0x21f,_0x516a90:0x225,_0x45640d:'b#7x',_0x14676d:'vMXq',_0x1be4ce:0x27d,_0x4e94f5:0xf5,_0x8fb0ad:0x299,_0x43b401:0x1cb},_0xebbe48=a0_0x24f8,_0x183ba2=a0_0x5688;lib[_0x183ba2(a0_0x4f47f1._0x133669)][_0x183ba2(a0_0x4f47f1._0x74d656)](lib[_0x183ba2(0x137)][_0xebbe48(a0_0x4f47f1._0x1bdc5b,'N2t4')]?_0xebbe48(a0_0x4f47f1._0x2edb3d,'wGV3'):_0x183ba2(a0_0x4f47f1._0xe269b)),_0x4c5c8d[_0x183ba2(a0_0x4f47f1._0x2e6383)]();const {..._0x1e0009}=_0x4ea145;a0_0x3d3945(_0x1e0009);const _0x38a6de=ui[_0x183ba2(a0_0x4f47f1._0x5c6158)][_0xebbe48(a0_0x4f47f1._0x2ed185,a0_0x4f47f1._0x50f557)](_0xebbe48(0x12b,a0_0x4f47f1._0x1bf2a5),document[_0xebbe48(0x1d3,a0_0x4f47f1._0x4c7fba)],_0x33e456=>{const _0x953971=_0xebbe48,_0x2bb4db=_0x183ba2;_0x33e456['stopPropagation'](),confirm(_0x2bb4db(0x20b))&&_0x38a6de[_0x953971(0x211,'nadX')]();});_0x38a6de[_0xebbe48(0x165,'F(Bl')]=function(){const _0x1cfc96=_0x183ba2,_0x51132d=_0xebbe48;a0_0x37db20['clear'](),_0x38a6de[_0x51132d(a0_0x46f66b._0x1bf48d,a0_0x46f66b._0x4cb90b)](),_0x4ad9ae[_0x1cfc96(a0_0x46f66b._0x4fe8cf)](),_0x4c5c8d[_0x1cfc96(a0_0x46f66b._0x38bf4c)]();const _0x47e622=document[_0x1cfc96(a0_0x46f66b._0x2d845b)](_0x1cfc96(a0_0x46f66b._0x246b05));!ui[_0x51132d(a0_0x46f66b._0x516a90,a0_0x46f66b._0x45640d)][_0x51132d(0x27a,a0_0x46f66b._0x14676d)](_0x47e622)&&(ui[_0x1cfc96(a0_0x46f66b._0x1be4ce)][_0x1cfc96(a0_0x46f66b._0x4e94f5)](_0x47e622),_0x47e622[_0x1cfc96(a0_0x46f66b._0x8fb0ad)](_0x1cfc96(a0_0x46f66b._0x43b401))),onclose();};const _0x4ad9ae=ui['create'][_0x183ba2(a0_0x4f47f1._0x5d3126)](_0xebbe48(a0_0x4f47f1._0x442a13,a0_0x4f47f1._0x2ae83e),document[_0xebbe48(a0_0x4f47f1._0x59d0e7,a0_0x4f47f1._0x50f557)],_0x362d73=>{_0x362d73['stopPropagation']();});_0x4ad9ae[_0xebbe48(a0_0x4f47f1._0x41448e,a0_0x4f47f1._0x50f557)]('touchmove',_0x3ab5c9=>{_0x3ab5c9['stopPropagation']();},!![]);const _0x3cf0fe=ui[_0xebbe48(a0_0x4f47f1._0x18145f,a0_0x4f47f1._0x184d41)][_0xebbe48(a0_0x4f47f1._0x3c70a6,a0_0x4f47f1._0x9fd46a)](_0x183ba2(a0_0x4f47f1._0xf39031),_0x4ad9ae),_0x4f5a6b=[],_0x663e95=document['createDocumentFragment'](),_0x4b1d7b=function(_0x447bb9,_0x34a778){if(_0x1e0009[_0x447bb9])return _0x1e0009[_0x447bb9];return _0x34a778??'';},_0x570c56=function(){const _0x42b0aa=_0xebbe48,_0x4100e7=_0x183ba2,_0x224741={},_0x34ad6a=_0x4f5a6b['filter'](_0x2a6a97=>!_0x2a6a97[_0x4100e7(0x2a4)][_0x4100e7(0xf3)][_0x4100e7(0x260)](_0x4100e7(0x115)));for(const _0x1cbc09 of _0x34ad6a){const {name:_0x2881b3,type:_0x57e3a2,value:_0x2ca3af,checked:_0x1de1db}=_0x1cbc09;_0x57e3a2===_0x42b0aa(a0_0x435bfa._0xce4e48,a0_0x435bfa._0x3734a7)?_0x224741[_0x2881b3]=_0x1de1db:_0x224741[_0x2881b3]=_0x2ca3af;}for(const _0x3cb683 of _0x34ad6a){const {name:_0x4644cd,checkFunction:_0xd744ff,labelNode:_0x4833f7}=_0x3cb683,_0x7f1458=_0xd744ff(_0x224741[_0x4644cd],_0x224741,_0x3cb683);if(_0x7f1458 instanceof Object){const {isOk:_0x57d67b,errorMessage:_0x4f05b5,data:_0x487923}=_0x7f1458;if(_0x57d67b){if(_0x487923!==undefined)_0x224741[_0x4644cd]=_0x487923;_0x4833f7[_0x4100e7(a0_0x435bfa._0xdbf433)][_0x4100e7(a0_0x435bfa._0x4a7056)](_0x42b0aa(0x228,a0_0x435bfa._0x4fad08));continue;}_0x4833f7['classList'][_0x4100e7(a0_0x435bfa._0x16c0e9)](_0x4100e7(a0_0x435bfa._0x13454b));const _0x33d3dc=_0x4833f7[_0x42b0aa(a0_0x435bfa._0x443655,a0_0x435bfa._0x32e7f9)][_0x42b0aa(a0_0x435bfa._0x54fae8,a0_0x435bfa._0x5685f2)](/：:/g,'');_0x224741[_0x42b0aa(a0_0x435bfa._0x4ba2ea,a0_0x435bfa._0x24ab89)]=!![],lib['qyMessage'][_0x4100e7(a0_0x435bfa._0x3eff57)]('校验错误「'+_0x33d3dc+'」：'+_0x4f05b5);}else _0x7f1458!==undefined&&(_0x224741[_0x4644cd]=_0x7f1458);}if(_0x224741['errorCheck'])throw new Error(_0x4100e7(a0_0x435bfa._0x3257e4));return _0x224741;},_0x3d56e8=function(_0x1764d4,_0x399ca7,..._0x53339a){const _0x7180d9=_0x183ba2,_0x304478=_0xebbe48,_0x46ce9d=function(_0x4a7aa8){const _0x14e072=a0_0x24f8,_0x426573=a0_0x5688;return _0x4a7aa8[_0x426573(a0_0xe8ae8c._0x3688b7)]==='checkbox'?_0x4a7aa8[_0x14e072(a0_0xe8ae8c._0x208e64,'GWkM')]:_0x4a7aa8[_0x14e072(a0_0xe8ae8c._0x265510,a0_0xe8ae8c._0x2460c4)];},_0x4f6236=_0x4f2cea=>{const _0x2c532c=_0x46ce9d(_0x1764d4);_0x399ca7['call'](_0x1764d4,_0x4f2cea,_0x2c532c,..._0x53339a);};let _0x5c5d1d=_0x304478(a0_0x55fda9._0x424cf8,'mRff');_0x1764d4 instanceof globalThis['HTMLSelectElement']&&(_0x5c5d1d=_0x7180d9(0x28f)),_0x1764d4[_0x304478(a0_0x55fda9._0x52a67f,a0_0x55fda9._0x5d6029)](_0x5c5d1d,_0x4f6236,!![]);},_0x45134e=function(_0x1cf473){const _0x5d8ba5=_0xebbe48,_0x5e1253=_0x183ba2;let {name:_0x4562cb,label:_0x525cad,default:_0x361545,containerTag:containerTag=_0x5e1253(a0_0x322cbc._0x4f3ec6),max:max=Infinity,min:min=-Infinity,step:step=0x1,nodeTag:nodeTag=_0x5e1253(a0_0x322cbc._0x535cac),nodeType:nodeType='',onclick:onclick=()=>{},onLoad:onLoad=(_0x36d8c1,_0xa447df)=>{},check:check=_0x510dae=>{},onchange:onchange=(_0xa62ccf,_0x48bbf8)=>{}}=_0x1cf473;if(!nodeType){if(typeof _0x361545===_0x5d8ba5(a0_0x322cbc._0x3248ca,a0_0x322cbc._0x2c9aff))nodeType=_0x5d8ba5(0x145,a0_0x322cbc._0x2afa39);else typeof _0x361545===_0x5d8ba5(0x1ab,'MxUw')&&(nodeType=_0x5d8ba5(0x17f,a0_0x322cbc._0xba3fc8));}nodeType=nodeType||_0x5e1253(0x138);nodeType===_0x5e1253(0x287)&&(containerTag=_0x5e1253(0x1a5));const _0x34abdc=globalThis[_0x5d8ba5(0x156,a0_0x322cbc._0x20b7bd)][_0x5e1253(a0_0x322cbc._0x575a3b)](),_0x134ff9=ui['create']['node'](containerTag+_0x5d8ba5(a0_0x322cbc._0x195ad5,a0_0x322cbc._0xa14f4e),_0x5e1253(a0_0x322cbc._0x46ef22)+_0x525cad+_0x5d8ba5(0x161,a0_0x322cbc._0x53af84));_0x134ff9[_0x5d8ba5(a0_0x322cbc._0x6e6446,a0_0x322cbc._0xa14f4e)]=_0x34abdc;let _0x33436b;if(nodeType===_0x5d8ba5(0xfe,a0_0x322cbc._0x4a3580)){const _0x40516c=lib[_0x5d8ba5(a0_0x322cbc._0x44bbf4,a0_0x322cbc._0x2d41f7)]({'max':max,'min':min,'speed':step,'isDrag':![],'visButton':![],'style':{},'events':{'input'(){const _0x54c835=_0x5e1253;onchange['call'](this,null,this[_0x54c835(a0_0x478f52._0x359695)],_0x1e0009,_0x4562cb);}}});_0x40516c[_0x5d8ba5(0x266,'mRff')]['padding']=0x0,_0x134ff9[_0x5d8ba5(a0_0x322cbc._0x5bbe93,a0_0x322cbc._0x123b81)](_0x40516c),_0x33436b=_0x40516c[_0x5d8ba5(a0_0x322cbc._0x29c80f,a0_0x322cbc._0x505da9)];}else _0x33436b=ui[_0x5e1253(a0_0x322cbc._0x47764a)][_0x5e1253(a0_0x322cbc._0x151687)](''+nodeTag,onclick),_0x134ff9[_0x5e1253(a0_0x322cbc._0x33364e)](_0x33436b);return _0x33436b[_0x5e1253(0x27f)]=_0x134ff9[_0x5e1253(a0_0x322cbc._0x31577a)],_0x134ff9['node']=_0x33436b,_0x33436b[_0x5e1253(a0_0x322cbc._0x2056b3)]=_0x2205a7=>_0x2205a7['stopPropagation'](),_0x33436b['id']=_0x34abdc,_0x33436b[_0x5d8ba5(a0_0x322cbc._0x14fc2b,a0_0x322cbc._0xa14f4e)]=nodeType,_0x33436b['value']=_0x4b1d7b(_0x4562cb,_0x361545),_0x33436b['name']=_0x4562cb,_0x33436b['checkFunction']=check,nodeType===_0x5e1253(a0_0x322cbc._0x2de22c)&&(_0x33436b[_0x5d8ba5(a0_0x322cbc._0x401b69,a0_0x322cbc._0xcf05c6)]=_0x33436b[_0x5d8ba5(a0_0x322cbc._0x41d3a9,a0_0x322cbc._0x3ebfea)]===_0x5e1253(a0_0x322cbc._0x2e2aef),delete _0x33436b[_0x5e1253(a0_0x322cbc._0x46b9e8)]),nodeTag===_0x5d8ba5(a0_0x322cbc._0x59b209,a0_0x322cbc._0x6ee868)&&(_0x33436b[_0x5e1253(a0_0x322cbc._0x302e9b)]=_0x4b1d7b(_0x4562cb,_0x361545)),_0x3d56e8(_0x33436b,onchange,_0x1e0009,_0x4562cb),onLoad(_0x33436b,_0x1e0009,_0x4562cb),_0x4f5a6b['push'](_0x33436b),a0_0x37db20[_0x5e1253(a0_0x322cbc._0x587931)](_0x4562cb,_0x134ff9),_0x663e95['appendChild'](_0x134ff9),_0x134ff9;};a0_0x3dfe51[_0x183ba2(a0_0x4f47f1._0x1d4170)](_0x49247f=>_0x45134e(_0x49247f)),a0_0x3dfe51[_0xebbe48(a0_0x4f47f1._0x4759c5,a0_0x4f47f1._0x15e7c5)](_0x267aeb=>{const _0x2e4d1f=_0xebbe48,{name:_0x4c8632,onMount:_0x3e34ca}=_0x267aeb;_0x3e34ca?.['call'](_0x267aeb,a0_0x37db20[_0x2e4d1f(0x270,'^l1Q')](_0x4c8632),_0x1e0009,_0x4c8632);}),_0x3cf0fe['appendChild'](_0x663e95);const _0x25b818=ui[_0x183ba2(a0_0x4f47f1._0x17132a)]['div'](_0x183ba2(a0_0x4f47f1._0x1518c4),_0x4ad9ae),_0x393ae6=ui['create'][_0x183ba2(a0_0x4f47f1._0x5d3126)]('','预览',_0x25b818,async _0x428cd6=>{const _0x5d6870=_0xebbe48,_0x3785c3=_0x183ba2,_0x53b5a6=_0x570c56();!_0x393ae6[_0x3785c3(a0_0x398c42._0x81e566)]&&(_0x393ae6[_0x5d6870(a0_0x398c42._0x196d54,a0_0x398c42._0x38e1c3)]=0x0);const _0x257c7b=game[_0x3785c3(a0_0x398c42._0x1960e6)][_0x5d6870(0x25a,a0_0x398c42._0x39aa25)](game[_0x3785c3(a0_0x398c42._0x3a4210)]);_0x393ae6[_0x3785c3(a0_0x398c42._0x81e566)]++;let _0x3ffb1a=0x1,_0x13a5f5;if(_0x393ae6[_0x3785c3(a0_0x398c42._0x4be451)]%0x8===0x0)_0x3ffb1a=0x8,_0x13a5f5=game['me'];else _0x393ae6[_0x3785c3(a0_0x398c42._0x4be451)]%0x9===0x0?_0x3ffb1a=0x8:_0x3ffb1a=get[_0x3785c3(a0_0x398c42._0x45507b)](0x1,Math[_0x5d6870(a0_0x398c42._0x3b7364,a0_0x398c42._0x58d5df)](_0x257c7b[_0x5d6870(a0_0x398c42._0x3790fd,'n9yy')],0x3));const _0x1b387d=_0x257c7b[_0x5d6870(a0_0x398c42._0x5ab7cb,'65ei')]([game['me']])[_0x3785c3(0x1c3)](_0x3ffb1a);_0x1b387d[_0x5d6870(a0_0x398c42._0x455c7a,a0_0x398c42._0x398f2a)](_0x1f7c31=>{const _0x57109b=_0x3785c3,_0x4ac509=_0x5d6870,{..._0x457c6c}=_0x53b5a6;if(!_0x457c6c[_0x4ac509(a0_0x202023._0x3688db,a0_0x202023._0xd9531e)])return;let _0x4ddb68=_0x1f7c31;if(_0x393ae6[_0x57109b(a0_0x202023._0xf71b54)]%0x9===0x0)_0x13a5f5=_0x1f7c31,_0x4ddb68=game['me'];else{if(!_0x13a5f5){const _0x2e1d24=[_0x1f7c31,game['me']];_0x13a5f5=_0x2e1d24[_0x57109b(a0_0x202023._0x222be7)](),_0x4ddb68=_0x2e1d24[0x0];}}const [_0x356d0a,_0x1356bd,_0x132400,_0x432072]=_0x13a5f5[_0x57109b(a0_0x202023._0x44519d)](_0x4ddb68),_0x256453={};_0x256453['x']=_0x356d0a,_0x256453['y']=_0x1356bd,_0x457c6c['start']=_0x256453;const _0x50d379={};_0x50d379['x']=_0x132400,_0x50d379['y']=_0x432072,_0x457c6c[_0x57109b(a0_0x202023._0x5e7a48)]=_0x50d379,lib[_0x57109b(a0_0x202023._0x5c561d)](_0x457c6c);});const _0x19493f=document['querySelector'](_0x5d6870(0x249,'&(Kb'));_0x19493f['style'][_0x3785c3(a0_0x398c42._0xbf193d)]=0x1869f,document[_0x5d6870(0x1c8,a0_0x398c42._0x34c459)]['appendChild'](_0x19493f);}),_0x58d39d=ui['create'][_0xebbe48(0x229,a0_0x4f47f1._0x4d3e0e)](_0xebbe48(a0_0x4f47f1._0x55e567,a0_0x4f47f1._0xe9d118),_0x183ba2(0x200),_0x25b818,async _0x1febfe=>{const a0_0x2acb22={_0x10482a:0x298,_0x4ee70e:0x232,_0x2f02d1:0x1cc},_0x206ad4=_0xebbe48,_0x3f35d7=_0x183ba2,_0xc00438=_0x570c56();for(let _0x79869a in _0xc00438){if(_0x4ea145[_0x3f35d7(a0_0x308909._0x2ebd1d)](_0x79869a)&&!_0xc00438[_0x206ad4(a0_0x308909._0x2cb27e,a0_0x308909._0x33ee8c)](_0x79869a))delete _0x4ea145[_0x79869a];else a0_0x165269[_0x3f35d7(0x20a)](_0x79869a)&&(_0x4ea145[_0x79869a]=_0xc00438[_0x79869a]);}lib[_0x206ad4(a0_0x308909._0x598f55,'&(Kb')][_0x4c7b20][_0x3f35d7(a0_0x308909._0x3b000c)]()['then'](()=>{const _0x2057a4=_0x206ad4,_0x361953=_0x3f35d7,_0x52902c=_0x28006c(_0x4ea145);_0x4c5c8d[_0x361953(a0_0xccf8f5._0x504e6e)][_0x361953(a0_0xccf8f5._0x418d60)](_0x52902c,_0x407b73),_0x38a6de[_0x2057a4(0x196,a0_0xccf8f5._0x124b15)](),lib['qyMessage']['queueMessageSuccess'](_0x2057a4(a0_0xccf8f5._0x317051,'NZRQ'));},_0x14488d=>{const _0xe4ef06=_0x3f35d7;lib[_0xe4ef06(a0_0x2acb22._0x10482a)][_0xe4ef06(a0_0x2acb22._0x4ee70e)](_0xe4ef06(a0_0x2acb22._0x2f02d1)+_0x14488d);});}),_0x35dbdf=ui[_0x183ba2(a0_0x4f47f1._0x3ec334)]['div']('',_0xebbe48(a0_0x4f47f1._0x1da5c1,a0_0x4f47f1._0x16a7f2),_0x25b818,async _0x1c9d29=>{const a0_0x2c7d4f={_0x347dae:0x13f,_0x11f9a6:'n9yy',_0x324679:0x279},_0x1592e7=_0x183ba2,_0x4b3a2c=_0xebbe48,{..._0x4f2b86}=_0x570c56();_0x25b818[_0x4b3a2c(0x2a9,a0_0x49e686._0x18dde9)](_0x58d39d)&&delete _0x4f2b86[_0x4b3a2c(a0_0x49e686._0x18b79d,a0_0x49e686._0x23f038)],lib[_0x4b3a2c(a0_0x49e686._0x3d88bd,a0_0x49e686._0x225e53)][_0x4c7b20][_0x4b3a2c(a0_0x49e686._0x2912d7,a0_0x49e686._0xc118c)](_0x4f2b86)[_0x1592e7(a0_0x49e686._0x8ed4e8)](()=>{const _0x4b6ba3=_0x4b3a2c,_0x2ff3c3=_0x1592e7,_0x3ef1c6=_0x28006c(_0x4f2b86);_0x4c5c8d[_0x2ff3c3(0x1aa)][_0x4b6ba3(a0_0x2c7d4f._0x347dae,a0_0x2c7d4f._0x11f9a6)](_0x3ef1c6,_0x407b73),_0x38a6de[_0x2ff3c3(a0_0x2c7d4f._0x324679)](),lib['qyMessage']['queueMessageSuccess'](_0x2ff3c3(0x29f));},_0x1913ef=>{const _0xea44ee=_0x4b3a2c;lib[_0xea44ee(a0_0x107f65._0x1147ab,a0_0x107f65._0x530d5c)][_0xea44ee(0x29d,'RXil')](_0xea44ee(0x205,'*3yg')+_0x1913ef);});});!lib[_0x183ba2(a0_0x4f47f1._0x55c11b)][_0x4c7b20]?.[_0x183ba2(0x26b)]?.[_0x183ba2(a0_0x4f47f1._0x35e7d5)](_0x4ea145)&&(_0x58d39d['remove'](),_0x35dbdf[_0xebbe48(0x23b,'^l1Q')]['add'](_0x183ba2(a0_0x4f47f1._0x47c144)));};lib['qyOpenLineEditor']({'dialogType':_0xefc30c(a0_0x242fbc._0x3583f1,'mRff'),'initItemMenuName'(_0x15fa90){const a0_0x55a8b8={_0x54c479:0x268,_0x5ea61b:'RXil',_0x17c552:0x15a,_0xc804db:0x1e3,_0x22e414:0x174,_0x2c1263:0x298,_0x1725bf:'l^^j',_0x3613fe:0x154,_0x56dc03:'N2t4',_0x4959b0:0x166,_0x4cba1a:'s*uQ'},_0x5416f9=_0xefc30c;let {label:_0x1fa391,action:_0xee07b7,forbid:_0x1151bd}=_0x15fa90;return _0xee07b7&&(_0x1fa391+='<span\x20class=\x22firetext\x22>('+_0xee07b7+_0x5416f9(0x28b,a0_0x1a229e._0x319430)),_0x1151bd&&(_0x1fa391+='&nbsp&nbsp|&nbsp禁用'),{'label':_0x1fa391,'onclick'(_0x484dcf){const _0x5b5624=a0_0x5688,_0x538a01=_0x5416f9;let {label:_0x1ba1d2,action:_0x398ef6,forbid:_0x5d264f}=_0x15fa90;_0x484dcf[_0x538a01(a0_0x55a8b8._0x54c479,a0_0x55a8b8._0x5ea61b)](),_0x15fa90['forbid']=_0x5d264f=!_0x5d264f,_0x398ef6&&(_0x1ba1d2+='<span\x20class=\x22firetext\x22>('+_0x398ef6+_0x538a01(a0_0x55a8b8._0x17c552,'j3BS')),_0x5d264f&&(_0x1ba1d2+=_0x5b5624(a0_0x55a8b8._0xc804db)),lib[_0x5b5624(a0_0x55a8b8._0x22e414)][_0x4c7b20]['sync'](),lib[_0x5b5624(a0_0x55a8b8._0x2c1263)][_0x538a01(0x26d,a0_0x55a8b8._0x1725bf)](_0x538a01(a0_0x55a8b8._0x3613fe,a0_0x55a8b8._0x56dc03)),this[_0x538a01(a0_0x55a8b8._0x4959b0,a0_0x55a8b8._0x4cba1a)]=_0x1ba1d2;}};},'initAddButton'(_0x135280,_0x24cc89,_0x7cf381){const _0x332432=a0_0x5688,_0x2e01f3=_0xefc30c;_0x135280[_0x2e01f3(a0_0x2624a3._0x2ede48,'LbN%')][_0x332432(a0_0x2624a3._0x27ace3)](_0x7cf381),_0x7cf381['innerHTML']=_0x332432(a0_0x2624a3._0x3621e0),_0x7cf381[_0x332432(a0_0x2624a3._0x4010d6)](_0xc4b53a=>{const _0x45b163=_0x332432,_0x3ed314=_0x2e01f3;_0xc4b53a[_0x3ed314(a0_0xa6bc03._0x26c56a,a0_0xa6bc03._0x5f39d2)](),_0xe11285[_0x45b163(0x257)](_0x7cf381,{'event':_0xc4b53a,'animationItem':{},'dialog':_0x135280,'addItemMenu':_0x24cc89,'menuItemContainer':_0x7cf381});});},'initMenuContent'(_0x2e50d3,_0x15e9a3,_0x413bce){const a0_0x23dc34={_0x31f8e6:'vMXq',_0x1cabab:0x20d},_0x32bf0=a0_0x5688,_0x53600a=_0xefc30c,_0x1ea209=function({name:_0x5ec29f,default:_0x4f0d37,label:_0x101af1,type:_0x54c761,check:_0x1cc28b,show:_0x1d6637}){const _0x3861b0=a0_0x5688,_0xa11dff=a0_0x24f8,_0x18ba5d=_0x413bce[_0x5ec29f]??_0x4f0d37;if(_0x18ba5d===undefined)return'默认';if(_0x54c761===_0xa11dff(0x179,a0_0x23dc34._0x31f8e6)||typeof _0x18ba5d===_0x3861b0(a0_0x23dc34._0x1cabab))return _0x18ba5d===!![]?'是':'否';return _0x18ba5d;};_0x15e9a3[_0x53600a(a0_0x5597c7._0x377b1b,a0_0x5597c7._0x1e2fee)]['add']('qy_animation_dialog_item_content_info');const _0x7d09f7=a0_0x3dfe51[_0x53600a(a0_0x5597c7._0x48e37e,a0_0x5597c7._0x30df21)](_0x14e1f0=>_0x14e1f0[_0x32bf0(0x1de)]);_0x7d09f7[_0x32bf0(a0_0x5597c7._0x1f8b0a)](_0x6aa03b=>ui[_0x53600a(0x1a7,'pJZr')]['div']('',_0x15e9a3,_0x6aa03b[_0x32bf0(0x1a5)]+'：<span\x20class=\x22firetext\x22>'+_0x1ea209(_0x6aa03b)+_0x53600a(0x271,'b#7x')));},'onLoad'(_0x120284,_0x4cf776){const _0x4e11f8=a0_0x5688,_0x43b4e7=_0xefc30c,_0x58da7f=animationList,_0x3c6398=document[_0x43b4e7(a0_0x410f03._0x3cb3cc,a0_0x410f03._0x4c9683)]();for(let _0x45ebe8 of _0x58da7f){const _0x354ae0=_0x4cf776(_0x45ebe8);_0x3c6398['appendChild'](_0x354ae0);}_0x120284[_0x4e11f8(a0_0x410f03._0x2c4798)][_0x4e11f8(a0_0x410f03._0x1a8a09)](_0x3c6398);},'buttonList':[{'text':'编辑','onclick':_0xe11285},{'text':'预览','onclick'({event:_0x21e10d,animationItem:_0x1fa943,dialog:_0x216054,menuItemContainer:_0x3a73a7}){const _0x503eb1=a0_0x5688,_0x228d44=_0xefc30c;_0x216054['hide']();const {..._0x4d7f08}=_0x1fa943,_0x5fce82=game[_0x228d44(a0_0x30997d._0x4f4d0d,a0_0x30997d._0x16237f)][_0x228d44(a0_0x30997d._0x36e552,'*3yg')](game['dead'])[_0x228d44(0x10c,'pJZr')]([game['me']])[_0x228d44(0x1cd,'Z76A')](),_0x4e8dec=[_0x5fce82,game['me']],[_0x5e9a66,_0x4abceb,_0xaf13cf,_0x5b344f]=_0x4e8dec[_0x228d44(a0_0x30997d._0xe0ef9d,'nadX')](0x1)[0x0][_0x228d44(a0_0x30997d._0x1eba6e,a0_0x30997d._0x1e2ac1)](_0x4e8dec[0x0]),_0x1b9dd4={};_0x1b9dd4['x']=_0x5e9a66,_0x1b9dd4['y']=_0x4abceb,_0x4d7f08['start']=_0x1b9dd4;const _0x335cc9={};_0x335cc9['x']=_0xaf13cf,_0x335cc9['y']=_0x5b344f,_0x4d7f08['end']=_0x335cc9;if(!_0x4d7f08[_0x228d44(a0_0x30997d._0x43437e,a0_0x30997d._0x5ce357)])return;lib['qyWorkerLine'](_0x4d7f08,(_0x2c26ed,_0x14425b)=>_0x216054[_0x503eb1(0x1de)]());}},{'text':'删除',async 'onclick'({event:_0x4e6a7a,animationItem:_0x5dc8e7,dialog:_0x531f0c,menuItemContainer:_0x42994d}){const a0_0x43e8a2={_0x2eac54:'qJhQ',_0xe978ab:0x216,_0x5972fb:0x1dd},_0x45ad19=_0xefc30c,_0x584702=a0_0x5688,_0x3b0e13=game[_0x584702(0x1c9)](_0x45ad19(a0_0xc54035._0x2f8148,a0_0xc54035._0x5ce7e5),_0x36f37d=>{const a0_0x596502={_0xe91aab:'GWkM',_0x2ef376:0x221},a0_0x215613={_0x3a0c7f:0xfb,_0x25a102:'6U4@',_0x439c22:0x1c4},_0x51523d=_0x584702,_0x395d58=_0x45ad19;if(_0x36f37d===![])return;lib['qyLineItem'][_0x4c7b20][_0x395d58(0x149,a0_0x43e8a2._0x2eac54)](_0x5dc8e7)[_0x395d58(a0_0x43e8a2._0xe978ab,'ndiI')](()=>{const _0x9f7b5c=a0_0x5688,_0x2b4314=_0x395d58;lib[_0x2b4314(a0_0x215613._0x3a0c7f,a0_0x215613._0x25a102)]['queueMessageInfo'](_0x9f7b5c(a0_0x215613._0x439c22));},_0x24efca=>{const _0x469d17=a0_0x5688,_0x260c8c=_0x395d58;lib[_0x260c8c(0x245,a0_0x596502._0xe91aab)]['queueMessageInfo'](_0x469d17(a0_0x596502._0x2ef376)+_0x24efca['toString']());}),_0x42994d[_0x51523d(a0_0x43e8a2._0x5972fb)]();});_0x531f0c[_0x584702(a0_0xc54035._0x5d9506)][_0x584702(a0_0xc54035._0x4bec39)](_0x3b0e13);}}],'dialogClose'(_0x9508ff,_0xde4631){onclose();}});},lib[a0_0x539d13(0x1dc)]=function(){const a0_0x2dded0={_0x64d431:0x1f7,_0x44eaf5:'j3BS'},a0_0x1bfece={_0x46ef49:'D!tV',_0x38be8a:'wGV3',_0x1ee841:0x203},a0_0x2e7e5c={_0x1b3cf9:0x102,_0x30de41:0x17d},a0_0x1829c9={_0x2c13cf:0xf3,_0x253f3d:0x238,_0x50fec2:0x280,_0x1259a7:'6U4@'},a0_0x3645c7={_0x1f90c1:0x276,_0xec29c1:0x207,_0x4e5ecf:0x2a0},a0_0xf258ce={_0x2ba612:0x109,_0x16a2be:'%V)(',_0xed3ebd:0x215,_0x11b528:'j3BS',_0x3d96a0:0x1ac},a0_0x4aabb5={_0x574aa0:0x1d1,_0x3837f9:0x24e},a0_0x1ba36b={_0x589a5e:0x18f,_0x185bf5:'b#7x',_0x22e6ff:0x1e8,_0x2a03f8:0x13c,_0x42f54c:'Q2hU',_0x4bfd49:0x1da,_0x20b409:0x1f8,_0x1f4354:0x24e,_0x394edd:0x1b4,_0xd29f99:'^l1Q',_0x5014eb:0x272,_0x1853a6:0x278,_0x95ab97:'Z76A',_0x306286:'nadX',_0x5f4c38:0x294,_0xa8b952:0x1b5,_0x110194:0x295,_0x3b00e2:0x26a,_0x4abaf9:'tjX6'},a0_0x583bcf={_0x5afb7d:0x133,_0x1f93f8:'Z76A',_0x52abbb:'D!tV',_0xa889ff:0xf5,_0x5e41cb:0x197},_0x144f1e=a0_0x5e8451,_0x2d225c=a0_0x539d13,_0x14b06f={'dialogType':_0x2d225c(0x12f),'onLoad'(_0x5b45cd,_0x44ccea){const _0x57b5d7=_0x2d225c,_0x4b219b=a0_0x24f8,_0x38734b=document[_0x4b219b(a0_0x583bcf._0x5afb7d,a0_0x583bcf._0x1f93f8)]();for(let [_0x29bc16,{dbName:_0x498bbe,data:_0x4f05a1,menu:_0x2d3fe9}]of Object[_0x4b219b(0x256,a0_0x583bcf._0x52abbb)](lib['qyLineItem'])){const _0x4e18a2={};_0x4e18a2[_0x57b5d7(0x236)]=_0x2d3fe9,_0x4e18a2[_0x57b5d7(0x162)]=_0x4f05a1;const _0x33473b=_0x44ccea(_0x4e18a2);_0x38734b[_0x57b5d7(a0_0x583bcf._0xa889ff)](_0x33473b);}_0x5b45cd[_0x4b219b(a0_0x583bcf._0x5e41cb,'e3Nm')][_0x4b219b(0x1f3,'LbN%')](_0x38734b);},'initItemMenuName'({animationMenu:_0x3e836e}){const _0xce043c=_0x2d225c;let {enable:_0x2c6dc2,name:_0x95d104}=_0x3e836e;return{'label':_0xce043c(a0_0x4aabb5._0x574aa0)+(_0x2c6dc2?'开启':_0xce043c(a0_0x4aabb5._0x3837f9)),'onclick'(_0x5c8973){const _0x279efa=_0xce043c,_0xf2c3e0=a0_0x24f8;_0x5c8973[_0xf2c3e0(a0_0x1ba36b._0x589a5e,a0_0x1ba36b._0x185bf5)](),_0x2c6dc2=_0x3e836e[_0x279efa(a0_0x1ba36b._0x22e6ff)]=!_0x2c6dc2,lib[_0xf2c3e0(a0_0x1ba36b._0x2a03f8,a0_0x1ba36b._0x42f54c)][_0x95d104][_0x279efa(a0_0x1ba36b._0x4bfd49)](),this[_0xf2c3e0(a0_0x1ba36b._0x20b409,'&Uqg')]='当前状态：'+(_0x2c6dc2?'开启':_0x279efa(a0_0x1ba36b._0x1f4354)),lib['qyMessage']['queueMessageInfo'](_0x279efa(0x176)+_0x95d104+this[_0xf2c3e0(a0_0x1ba36b._0x394edd,a0_0x1ba36b._0xd29f99)]+'成功');const {triggerCustom:_0x5261f3,qyAnimationLineSkill:_0x229fa3}=lib[_0x279efa(0x163)][_0xf2c3e0(a0_0x1ba36b._0x5014eb,a0_0x1ba36b._0x185bf5)]();game[_0xf2c3e0(a0_0x1ba36b._0x1853a6,a0_0x1ba36b._0x95ab97)](_0xf2c3e0(0x23a,a0_0x1ba36b._0x306286)),lib[_0x279efa(a0_0x1ba36b._0x5f4c38)][_0x279efa(a0_0x1ba36b._0xa8b952)][_0x279efa(a0_0x1ba36b._0x110194)]=_0x5261f3,lib[_0xf2c3e0(a0_0x1ba36b._0x3b00e2,a0_0x1ba36b._0x4abaf9)]=_0x229fa3,game[_0xf2c3e0(0x21d,'LbN%')]('_qyAnimationLine');}};},'initAddButton'(_0x39f901,_0x401be7,_0xac1b13){const a0_0x4e009b={_0x2645e5:0xf4,_0x16551f:0x1db,_0x10a643:0x262,_0xdf460f:'vMXq'},a0_0x239d8b={_0x2e8f9a:0x1ad,_0x1e3ff1:'Z76A',_0x447854:0x298,_0x1d6368:'6U4@',_0x9a25ee:0x2a7,_0x1471a9:'RXil',_0x443a12:0x210,_0x4aa421:'p9@u',_0x1a9dba:0x217,_0x239cb7:'(op^',_0x4b72a8:0x1aa,_0x6f93d3:0x1fe},_0x43befb=_0x2d225c,_0x455db9=a0_0x24f8;_0xac1b13[_0x455db9(0x218,'BZNO')]=_0x455db9(a0_0xf258ce._0x2ba612,a0_0xf258ce._0x16a2be),_0x39f901['content'][_0x455db9(a0_0xf258ce._0xed3ebd,a0_0xf258ce._0x11b528)](_0xac1b13),_0xac1b13[_0x43befb(a0_0xf258ce._0x3d96a0)](async _0x3403bd=>{const _0x3f875a=_0x455db9,_0x50db3d=_0x43befb;_0x3403bd[_0x50db3d(0x276)]();const _0x31a721=game[_0x50db3d(a0_0x4e009b._0x2645e5)](_0x50db3d(a0_0x4e009b._0x16551f),async function(_0x325bdc){const _0x2f9d37=_0x50db3d,_0x4c1bb2=a0_0x24f8;if(_0x325bdc===![])return;if(lib[_0x4c1bb2(a0_0x239d8b._0x2e8f9a,a0_0x239d8b._0x1e3ff1)][_0x325bdc]){lib[_0x2f9d37(a0_0x239d8b._0x447854)][_0x4c1bb2(0x140,a0_0x239d8b._0x1d6368)](_0x4c1bb2(a0_0x239d8b._0x9a25ee,a0_0x239d8b._0x1471a9));return;}const _0x183b9e=new LocalFileDB(dlcDirectory,_0x325bdc,{'name':_0x325bdc,'label':_0x325bdc,'enable':!![]});await _0x183b9e[_0x4c1bb2(a0_0x239d8b._0x443a12,a0_0x239d8b._0x4aa421)](),lib['qyLineItem'][_0x325bdc]=_0x183b9e;const _0x4dca6e={};_0x4dca6e[_0x4c1bb2(a0_0x239d8b._0x1a9dba,'LbN%')]=_0x183b9e['menu'],_0x4dca6e['animationList']=_0x183b9e[_0x4c1bb2(0x25d,a0_0x239d8b._0x239cb7)];const _0x5dcf0c=_0x401be7(_0x4dca6e);_0x39f901[_0x2f9d37(a0_0x239d8b._0x4b72a8)][_0x2f9d37(a0_0x239d8b._0x6f93d3)](_0x5dcf0c,_0xac1b13);});_0x39f901['parentElement'][_0x3f875a(a0_0x4e009b._0x10a643,a0_0x4e009b._0xdf460f)](_0x31a721);});},async 'initMenuContent'(_0xc76122,_0x1db31e,{animationMenu:_0x476c8c,animationList:_0x3058e8}){const _0x590d95=a0_0x24f8,_0x250e0c=_0x2d225c;_0x1db31e[_0x250e0c(a0_0x1829c9._0x2c13cf)][_0x590d95(0x136,'Q2hU')](_0x250e0c(a0_0x1829c9._0x253f3d));const {label:_0x1566d9}=_0x476c8c;_0x1db31e[_0x250e0c(0x208)]=_0x1566d9,_0x1db31e[_0x590d95(a0_0x1829c9._0x50fec2,a0_0x1829c9._0x1259a7)](async _0x4f41ab=>{const a0_0x1863f3={_0x3e5ea8:0x11d,_0x531048:'6U4@'},_0x35b373=_0x250e0c;_0x4f41ab[_0x35b373(a0_0x3645c7._0x1f90c1)](),lib[_0x35b373(a0_0x3645c7._0xec29c1)]({'animationList':_0x3058e8,'qyLineItemUUID':_0x1566d9,'onclose'(){const _0x1e5841=a0_0x24f8;_0xc76122[_0x1e5841(a0_0x1863f3._0x3e5ea8,a0_0x1863f3._0x531048)]();}}),_0xc76122[_0x35b373(a0_0x3645c7._0x4e5ecf)]();});},'buttonList':[{'text':'编辑',async 'onclick'({animationItem:_0x4996d8,dialog:_0x3ca0f8}){const _0x34f8e7=a0_0x24f8,_0x5c0840=_0x2d225c;lib[_0x5c0840(0x298)][_0x5c0840(a0_0x2e7e5c._0x1b3cf9)](_0x34f8e7(a0_0x2e7e5c._0x30de41,'e3Nm'));}},{'text':'删除','onclick'({animationItem:_0x1a14e4,dialog:_0x452466,menuItemContainer:_0x3f7f4a}){const a0_0x514c1f={_0x1e1597:0x298,_0x4e7440:0x13b,_0x32fede:'aTcF',_0x4eaedd:0x15f,_0x3808b6:0x174,_0x4ebb89:0x171,_0xaa7637:'nadX',_0x36149f:0x11a,_0xa88cf9:'%V)(',_0x762f08:0x1b2,_0x14aaef:0x1f4,_0x7b6553:')z%3',_0x79a520:0x29a,_0x32f43b:0x110,_0x2b8c3a:0x28c,_0x587588:0x1c4},_0x1c0a80=a0_0x24f8,{animationMenu:_0x43b18e,animationList:_0x48e18e}=_0x1a14e4,{name:_0x268b34,label:_0x4d6479}=_0x43b18e;if(!lib[_0x1c0a80(0xf2,a0_0x1bfece._0x46ef49)][_0x268b34])return;const _0xb81b62=game[_0x1c0a80(0x277,a0_0x1bfece._0x38be8a)](_0x1c0a80(a0_0x1bfece._0x1ee841,'qJhQ'),async _0xa58ab2=>{const _0x5f06ce=_0x1c0a80,_0x231d26=a0_0x5688;if(_0xa58ab2===![])return;lib[_0x231d26(a0_0x514c1f._0x1e1597)][_0x5f06ce(a0_0x514c1f._0x4e7440,a0_0x514c1f._0x32fede)](_0x231d26(a0_0x514c1f._0x4eaedd)),await lib[_0x231d26(a0_0x514c1f._0x3808b6)][_0x268b34]['unlinkFileDB']();const _0x4d86f2=values[_0x5f06ce(a0_0x514c1f._0x4ebb89,a0_0x514c1f._0xaa7637)](({status:_0x37c241,reason:_0x50e014})=>_0x37c241===_0x5f06ce(0x18e,'2[1&'))[_0x5f06ce(a0_0x514c1f._0x36149f,a0_0x514c1f._0xa88cf9)](({reason:_0x4e6bd2})=>_0x4e6bd2)[_0x231d26(a0_0x514c1f._0x762f08)](_0x5f06ce(a0_0x514c1f._0x14aaef,a0_0x514c1f._0x7b6553));_0x4d86f2?game['qyalert'](_0x5f06ce(a0_0x514c1f._0x79a520,'*3yg')+_0x4d86f2):(_0x3f7f4a[_0x231d26(a0_0x514c1f._0x32f43b)](0xc8),lib['qyMessage'][_0x231d26(a0_0x514c1f._0x2b8c3a)](_0x231d26(a0_0x514c1f._0x587588)),delete lib['qyLineItem'][_0x268b34]);});_0x452466[_0x1c0a80(0x15c,'GWkM')](_0xb81b62);}}]};lib[_0x144f1e(a0_0x2dded0._0x64d431,a0_0x2dded0._0x44eaf5)](_0x14b06f);};

    lib.qyArenaReadyPushOrRunStart(function () {
        ui.create.system('指示线编辑器', function () {
            lib.qyOpenLineGroupEditor();
        }, true, true);
    });

    /**
     * 指示线的功能工具类
     */
    lib.qyAnimationLineUtil = {
        /**
         * 开始的缓存
         */
        _startCache: {
            x: -1,
            y: -1,
            value: null,
        },
        /**
         * 结束的缓存
         */
        _endCache: {
            x: -1,
            y: -1,
            value: null,
        },
        /**
         * 获取所有特效，支持过滤和映射操作
         * @param {Object} filterObj 过滤对象
         * @param {Array} filterObj.menuChains 特效分类过滤函数数组
         * @param {Array} filterObj.itemChains 特效实例过滤函数数组
         * @returns {Array} 过滤后的特效实例数组
         */
        getAll(filterObj = {menuChains: [], itemChains: []}) {
            const {menuChains = [], itemChains = []} = filterObj;
            /**
             * @type {[string, LocalFileDB][]}
             */
            const entries = Object.entries(lib.qyLineItem);
            if (entries.length === 0) {
                return [];
            }

            // const startTime = Date.now();
            const allAnimationList = [];

            // 过滤特效分类的函数
            const filterMenu = (menu) => menuChains.every(filter => filter(menu));

            // 过滤特效实例的函数
            const filterItem = (item) => itemChains.every(chain => {
                if (typeof chain !== 'function') return true;
                const {...value} = item;
                const result = chain(value);

                if (typeof result === 'boolean' || result === undefined) {
                    return result;
                } else {
                    item = result;
                    return true;
                }
            });

            // 遍历所有特效分类
            for (const [dbName, {data, menu}] of entries) {
                // 应用特效分类过滤函数
                if (!filterMenu(menu)) continue;
                // 遍历特效分类下的特效实例
                if (!data?.length) continue;

                // 应用特效实例过滤函数并将过滤后的特效实例添加到结果数组中
                const filteredItems = data.filter(filterItem);
                allAnimationList.push(...filteredItems);
            }

            // console.log("getAll：耗时：%s", Date.now() - startTime);
            return allAnimationList;
        },
        /**
         * 获取全部开启的特效，支持filter和map操作
         * @param  {...any} chains 操作函数
         * @returns
         */
        getEnableAll(...chains) {
            // 过滤菜单是否开启
            const menuChains = [function (menu) {
                return !!menu.enable;
            }]
            // 单个选项是否禁用
            const itemChains = [function (item) {
                return !item.forbid;
            }]
            const mergeItemChains = itemChains.concat(chains);

            return lib.qyAnimationLineUtil.getAll({
                menuChains,
                itemChains: mergeItemChains,
            })
        },
        getEnableTrigger(){
            // 自定义的一些特效
            const triggerCustom = {};
            const qyAnimationLineSkill = {};
            // 遍历 lib.qyLineItem 中的所有值
            for (const qyAnimationItemValue of Object.values(lib.qyLineItem)) {
                const { data: qyAnimationItemValueData,menu } = qyAnimationItemValue;
                if (!menu?.enable) {
                    continue;
                }
                // 如果当前项的 data 属性不存在或长度为0，跳过当前循环
                if (!qyAnimationItemValueData?.length) continue;
                // 遍历当前分组的所有特效
                for (const value of qyAnimationItemValueData) {
                    const { trigger, enableTrigger } = value;
                    // 没有开启触发时机
                    if (!enableTrigger) continue;
                    // 检查触发时机是否为对象类型
                    if (!(trigger instanceof Object)) continue;
                    // 遍历触发时机对象的键值对
                    const entries = Object.entries(trigger);
                    // 没有值
                    if (entries.length === 0) continue;
                    for (const [triggerKey, triggerValue] of entries) {
                        // 初始化 triggerCustom 对应的键为去重后的数组
                        if (!triggerCustom[triggerKey]) triggerCustom[triggerKey] = [];
                        const triggerValueArray = Array.from(new Set([].concat(triggerValue)));
                        // 合并并去重触发时机的值
                        triggerCustom[triggerKey] = Array.from(new Set([...triggerCustom[triggerKey], ...triggerValueArray]));
                        // 更新 qyAnimationLineSkill 对象
                        for (const item of triggerValueArray) {
                            if (!qyAnimationLineSkill[item]) qyAnimationLineSkill[item] = [];
                            qyAnimationLineSkill[item].push(value);
                        }
                    }
                }
            }
            return { triggerCustom, qyAnimationLineSkill }
        },
        /**
         * 指示线播放完毕<br/>
         * 这里处理加载事件
         * @param options
         */
        lineCompleted({completes = [], start, end}) {
            if (!Array.isArray(completes) || !completes.length) return;
            const groupBy = Object.groupBy(completes, item => {
                if (typeof item === 'object') {
                    return 'animation';
                } else {
                    return 'line';
                }
            });
            // 这里是播放特效的
            if (groupBy.animation?.length) {
                const configIds = groupBy.animation.map(item => item.configId).filter(item => item);
                if(configIds) {
                    const list = lib.qyAnimationCustomUtil.getAnimationConfigList(configIds, false);
                    list.forEach(options => {
                        const find = groupBy.animation.find(item => item.configId === options.configId);
                        if (!find) return;
                        const {type, target} = find;
                        const { configId } = options;
                        if (!configId) {
                            return;
                        }
                        if (type !== 'animation') {
                            return;
                        }
                        if (!['start', 'end'].includes(target)) {
                            return;
                        }
                        const {...item} = options;
                        delete item.follow;// 删除跟随
                        delete item.position
                        item.parent = target === 'start' ? start : end;
                        JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, item.name, item, null, {});
                    });
                }
            }

            // 这是播放附加指示线的
            if (groupBy.line?.length) {
                const configIds = groupBy.line.filter(item => item);
                if(configIds) {
                    const list = lib.qyAnimationLineUtil.getAnimationConfigList(configIds, false);
                    list.forEach(options => {
                        const {...copyOptions} = options;
                        lib.qyWorkerLine(copyOptions);
                    });
                }
            }
        },
        /**
         * 播放附加特效
         * @param copyAnimation
         */
        playAppendAnimation(copyAnimation = {}){
            requestAnimationFrame(() => {
                const {appendAnimation: appendAnimationList, configId, start, end} = copyAnimation;
                // 找到所有已开启的特效
                if (!Array.isArray(appendAnimationList) || appendAnimationList.length === 0) {
                    return;
                }
                // 过滤掉自己，防止出现无限调用的情况
                const configIds = appendAnimationList.filter(item => item !== configId);
                const animationConfigList = lib.qyAnimationLineUtil.getAnimationConfigList(configIds, false);
                if (animationConfigList.length === 0) {
                    return;
                }
                animationConfigList.forEach(animationConfig => {
                    const { ...copyOptions } = animationConfig
                    copyOptions.start = start
                    copyOptions.end = end
                    lib.qyWorkerLine(copyOptions);
                });
            })
        },
        cacheRectPlayerMap: (function(){
            const map = new Map();
            let index = 0;
            // 更新缓存
            function updateCacheRect() {
                requestAnimationFrame(() => {
                    if (!ui.arena || !game.me || !ui.me) return;
                    const players = Array.from(ui.arena.querySelectorAll('div.player')).concat(ui.me);
                    if (players.length > 0) {
                        const player = players[index % players.length];
                        map.set(player, player.getBoundingClientRect());
                        index++;
                    }
                });
                setTimeout(() => updateCacheRect(), 500);
            }
            updateCacheRect();

            return map;
        })(),
        /**
         * 从坐标获取元素
         * @return {null|HTMLDivElement}
         */
        getElementByPoint(x, y) {
            const {cacheRectPlayerMap} = lib.qyAnimationLineUtil;
            const players = [ui.me].concat(Array.from(ui.arena.querySelectorAll('div.player')));
            for (const player of players) {
                if (!player) {
                    continue;
                }
                let rect;
                if (cacheRectPlayerMap.has(player)) {
                    rect = cacheRectPlayerMap.get(player);
                } else {
                    rect = player.getBoundingClientRect();
                    cacheRectPlayerMap.set(player, rect);
                }
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    if (player === ui.me) {
                        return game.me;
                    }
                    return player;
                }
            }
            return null;
        },
        /**
         * 获取到player
         * @param elements
         * @return {HTMLDivElement|null}
         */
        getElement(elements) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element && element.classList.contains('player')) {
                    return element;
                }
                if (element === ui.me) {
                    return game.me;
                }
            }
            return null;
        },
        cacheMePosition: (function(){
            let cacheMePosition = {x:-1,y:-1,meCenter:-1};
            // 更新缓存
            function updateCacheRect() {
                requestAnimationFrame(() => {
                    if (!ui.me || !game.me || !ui.arena) return;
                    const {cacheRectPlayerMap} = lib.qyAnimationLineUtil;
                    cacheMePosition.y = Math.floor(ui.me.getBoundingClientRect().y);
                    cacheMePosition.x = Math.floor(ui.window.clientWidth / 2);
                    let meRect = cacheRectPlayerMap.get(game.me);
                    if (!meRect) {
                        meRect = game.me.getBoundingClientRect();
                        cacheRectPlayerMap.set(game.me, meRect);
                    }
                    cacheMePosition.meCenter = qyAnimationUtil.rect2JSON(meRect);
                });
                setTimeout(() => updateCacheRect(), 550);
            }
            updateCacheRect();

            return cacheMePosition;
        })(),
        /**
         * 检查xy是否
         * @param x
         * @param y
         * @return {*|null}
         */
        checkAndGetPosition(x, y) {
            const {x: meX, y: meY, meCenter} = lib.qyAnimationLineUtil.cacheMePosition;
            if (Math.floor(x) === meX && Math.floor(y) === meY) {
                return meCenter
            }
            return {x,y};
        },
        getPlayerCardStartEnd(copyOptions = {}) {
            let {start, end, isPlayerCard} = copyOptions;
            if (!isPlayerCard) {
                return {start, end}
            }
            const {checkAndGetPosition} = lib.qyAnimationLineUtil;
            // 获取到坐标
            const {x: x1, y: y1} = qyAnimationUtil.getCenter(start);
            const {x: x2, y: y2} = qyAnimationUtil.getCenter(end);

            return {start: checkAndGetPosition(x1, y1), end: checkAndGetPosition(x2, y2)};
        },
        /**
         * 获取指定配置ID的动画列表
         * @param {Array[string]} configIds - 配置ID
         * @param {Boolean} enable 是否为开启的特效
         * @returns {Array} - 符合条件的动画列表
         */
        getAnimationConfigList(configIds, enable = true) {
            if (!configIds) return [];
            if (!Array.isArray(configIds)) {
                configIds = [configIds];
            }
            if (configIds.length === 0) {
                return [];
            }
            const filterByConfigId = ({configId: configUUID}) => configIds.includes(configUUID);
            if (enable) {
                return this.getEnableAll(filterByConfigId);
            }
            return this.getAll({
                itemChains: [filterByConfigId],
            });
        },
    }

    let filterFunction = function () {
        return true
    };
    // 找到非懒加载
    if (lib.qyUtils.getConfig('qingyao_lazy_loader', false)) {
        filterFunction = function ({is_lazy}) {
            return !is_lazy
        }
    }
    // 找到非懒加载
    let notLazyList = lib.qyAnimationLineUtil.getEnableAll(filterFunction);
    notLazyList = lib.qyUtils.uniqueKeys(notLazyList, (({name}) => name));
    console.log("非懒加载的指示线：", notLazyList);
    lib.qyUtils.checkConditionUntilMet(function () {
        return new Promise((resolve, reject) => {
            if (!globalThis.qyAnimationUtil || !lib.qyWebWorker) {
                setTimeout(() => {
                    resolve(false);
                }, 200);
                return;
            }
            const messageId = qyAnimationUtil.generatorUUID();
            JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, "", {}, null, {
                action: qyWorkerAction.HAS_APPLICATION,
                messageId,
                callback: (data, error) => {
                    resolve(data);
                }
            });
        });
    })
        .then(res => {
            const {animationPath, baseUrl} = lib.qyWorkerLoadEnv;
            const assets = notLazyList.map(({name, fileType= '.png'}) => {
                return {alias: name + fileType, src: baseUrl + animationPath + name + fileType}
            });
            const bundle = {
                name: 'backgroundLineBundle',
                assets,
            }
            JzwdWebWorkerOrMainWorker(lib.qyPlayerApp, "", bundle, null, {
                action: qyWorkerAction.LOAD_BUNDLE,
            });
        });

    lib.qyAnimationLineSkill = {}
    lib.qyArenaReadyPushOrRunStart(() => {
        /**
         * 检测是不是玩家自己，并自动设置为ui.me，并返回坐标
         * @param target
         * @param center
         * @return {number[]}
         */
        lib.element.player.checkAndGetLinePointer = function (target, center = true) {
            const player = this;
            let x1, y1;
            let x2, y2;

            if (player === game.me) {
                if (center) {
                    const handRect = ui.me.getBoundingClientRect();
                    x1 = ui.window.clientWidth / 2;
                    y1 = handRect.y;
                } else {
                    const {x, y} = qyAnimationUtil.getCenter(player);
                    x1 = x;
                    y1 = y;
                }
            } else {
                const {x, y} = qyAnimationUtil.getCenter(player);
                x1 = x;
                y1 = y;
            }

            if (target === game.me) {
                if (center) {
                    const handRect = ui.me.getBoundingClientRect();
                    x2 = ui.window.clientWidth / 2;
                    y2 = handRect.y;
                } else {
                    const {x, y} = qyAnimationUtil.getCenter(target);
                    x2 = x;
                    y2 = y;
                }
            } else {
                const {x, y} = qyAnimationUtil.getCenter(target);
                x2 = x;
                y2 = y;
            }
            return [x1, y1, x2, y2];
        }
        /**
         * 覆盖
         * @param target
         * @param config
         */
        lib.element.player.line = function (target, config) {
            if (get.itemtype(target) === 'players') {
                for (var i = 0; i < target.length; i++) {
                    this.line(target[i], config);
                }
            } else if (get.itemtype(target) === 'player') {
                if (target === this) {
                    return;
                }
                var player = this;
                game.broadcast(function (player, target, config) {
                    player.line(target, config);
                }, player, target, config);
                game.addVideo('line', player, [target.dataset.position, config]);

                game.linexy(this.checkAndGetLinePointer(target), config, true);
            }
        }
        game.players.forEach(item => {
            item.line = lib.element.player.line;
            item.checkAndGetLinePointer = lib.element.player.checkAndGetLinePointer;
        });

        game.linexy = function (path) {
            // 筛选已开启，并且没有时机的指示线
            const enableLineList = lib.qyAnimationLineUtil.getEnableAll(({enableTrigger}) => !enableTrigger);

            const startElement = lib.qyAnimationLineUtil.getElementByPoint(path[0], path[1]);

            enableLineList.forEach(options => {
                let startValue = {
                    x: path[0],
                    y: path[1],
                }
                let endValue = {
                    x: path[2],
                    y: path[3],
                }
                const {...copyOptions} = options;
                const endElement = lib.qyAnimationLineUtil.getElementByPoint(path[2], path[3]);
                copyOptions.start = startValue;
                copyOptions.end = endValue;
                if (typeof copyOptions.filter === 'function') {
                    try {
                        const event = _status.event;
                        const trigger = event._trigger ?? event;
                        const filter = copyOptions.filter(trigger, startElement, event, startElement, endElement);
                        if (!filter) return;
                    } catch (e) {
                        console.error("game.linexy", options.name, options.label, "过滤错误", e);
                    }
                }
                lib.qyWorkerLine(copyOptions);
            });
        }

        const { triggerCustom, qyAnimationLineSkill } = lib.qyAnimationLineUtil.getEnableTrigger();
        lib.qyAnimationLineSkill = qyAnimationLineSkill;
        lib.qyLineCheckAndUseAnimation = function (useList, trigger, event, player, target) {
            for (let useListElement of useList) {
                // 先复制一份属性
                const {...copyUseListElement} = useListElement;
                const {startPosition, endPosition, filter} = copyUseListElement;
                let start, end;
                try {
                    start = eval(`(${startPosition})`);
                    end = eval(`(${endPosition})`);
                    if (!filter(trigger, player, event, start, end)) continue;
                    const [x1, y1, x2, y2] = start.checkAndGetLinePointer(end);
                    copyUseListElement.start = {
                        x: x1,
                        y: y1,
                    }
                    copyUseListElement.end = {
                        x: x2,
                        y: y2,
                    }
                    lib.qyWorkerLine(copyUseListElement);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        lib.skill._qyAnimationLine = {
            trigger: triggerCustom,
            filter: lib.filter.all,
            firstDo: true,
            forced: true,
            priority: 97,
            forceDie: true,
            popup: false,
            silent: true,
            content: function () {
                const useList = [];
                // 开始筛选本时机的特效
                for (const [key, animateElement] of Object.entries(lib.qyAnimationLineSkill)) {
                    // 时机不对，就跳过
                    if (key !== event.triggername) continue;
                    useList.push(...animateElement);
                }
                // 一般是不会检索不出来的。。。
                if (!useList.length) return;
                // 使用这些特效
                lib.qyLineCheckAndUseAnimation(useList, trigger, event, player, target);
            },
        }
        game.addGlobalSkill('_qyAnimationLine');
    });

});