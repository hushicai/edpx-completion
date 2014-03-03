var cli = {};

cli.command = 'completion';

cli.description = 'edp tab completion';

cli.usage = 'edp completion >> ~/.bash_profile';

// 如果能自动获取所有命令就好了
// edp开放给extension的权限实在是太少了，居然只有一个args
// 暂时只能苦逼地手工配置节点树了
// TODO: options completion支持
var root = {
    name: 'edp',
    children: [
        {
            name: 'beautify',
            children: []
        },
        {
            name: 'build',
            children: []
        },
        {
            name: 'config',
            children: []
        },
        {
            name: 'completion',
            children: []
        },
        {
            name: 'csslint',
            children: []
        },
        {
            name: 'csslint',
            children: []
        },
        {
            name: 'extension',
            children: [
                {
                    name: 'add',
                    children: []
                },
                {
                    name: 'remove',
                    children: []
                }
            ]
        },
        {
            name: 'help',
            children: []
        },
        {
            name: 'htmllint',
            children: []
        },
        {
            name: 'import',
            children: []
        },
        {
            name: 'jshint',
            children: []
        },
        {
            name: 'minify',
            children: []
        },
        {
            name: 'project',
            children: [
                {
                    name: 'init'
                }
            ]
        },
        {
            name: 'search',
            children: []
        },
        {
            name: 'test',
            children: []
        },
        {
            name: 'update',
            children: []
        },
        {
            name: 'watch',
            children: []
        },
        {
            name: 'webserver',
            alias: 'ws',
            children: [
                {
                    name: 'start'
                    // children: []
                }
            ]
        }
    ]
};

// 宽度优先搜索
function bfs(name) {
    var queue = [];

    if (root.name === name) {
        return root.children;
    }

    var p = root;
    var q;
    var c;
    
    while(p) {
        c = p.children || [];
        // 第一个子节点
        q = c.shift();
        while(q) {
            // 标记
            queue.push(q);
            if (q.name === name
                || q.alias === name
            ) {
                return q.children;
            }
            // 下一个兄弟节点
            q = c.shift();
        }
        p = queue.shift();
    }

    return null;
}

// 获取匹配结果
function getCompeter(pkg) {
    var result = bfs(pkg);
    var completers = [];

    if (result) {
        for(var i = 0, len = result.length; i < len; i++) {
            var item = result[i];
            if (item.alias) {
                completers.push(
                    item.alias
                );
            }
            completers.push(
                result[i].name
            );
        }
    }

    return completers;
}

var tabtab = require('tabtab');

cli.main = function(args) {
    var l = args.length;
    var pkg = args[l - 2] || 'edp';
    var completer = getCompeter(pkg);

    return tabtab.complete(
        pkg, 
        function(err, data) {
            if (err || !data) {
                return;
            }

            tabtab.log(
                completer,
                data
            );
        }
    );
};

exports.cli = cli;
