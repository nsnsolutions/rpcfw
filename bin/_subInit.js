'use strict';

const packageJson = require('../package.json');

var libVersion = packageJson.version.split('.');
libVersion.pop();

const tryRequire = require('./_tryRequire');
const path = require('path');
const fs = require('fs');
const cmdPrompt = tryRequire('prompt');
const nunjucks = tryRequire('nunjucks');
const prompt_schema = {
    properties: {
        SERVICE_NAME: {
            description: "Service Name",
            pattern: /^[a-zA-Z0-9\.\_]+$/,
            message: "Service name can only contain letters, numbers dots and underscores.",
            required: true
        },
        SERVICE_DESCRIPTION: {
            description: "Service Description",
            message: "Service Description",
            required: true
        },
        RPCLIB_VERSION: {
            description: "RPCLib Version",
            pattern: /^v[0-9]+\.[0-9]$/,
            message: "RPCLib Version should look something like v0.0",
            default: "v" + libVersion.join('.'),
            required: true
        }
    }
}

module.exports = function Init(opts) {
    var template_dir = path.join( __dirname, "..", "assets"),
        target_dir = path.normalize(path.join(process.cwd(), opts.dir)),
        templateLoader = null,
        templateEngine = null,
        outputs = [
            // Metadata
            { name: "README.md",    target: path.join(target_dir, "README.md")      },
            { name: "Service.yml",  target: path.join(target_dir, "Service.yml")    },
            { name: "package.json", target: path.join(target_dir, "package.json")   },

            // Source code
            { name: "src/index.js",            target: path.join(target_dir, 'src', "index.js") },
            { name: "src/services/index.js",  target: path.join(target_dir, 'src', 'services', "index.js") },
            { name: "src/services/hello.js",  target: path.join(target_dir, 'src', 'services', "hello.js") },
        ];


    // Configure prompt.
    cmdPrompt.message = "";
    cmdPrompt.delimiter = ": ";
    cmdPrompt.colors = false;

    templateLoader = new nunjucks.FileSystemLoader(template_dir)
    templateEngine = new nunjucks.Environment(templateLoader);

    cmdPrompt.start();
    cmdPrompt.get(prompt_schema, function(err, promptResults) {

        // Write each file.
        outputs.forEach((item) => {
            var content = templateEngine.render(item.name, promptResults);
            var targetDir = path.dirname(item.target);
            if(!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

            if(fs.existsSync(item.target) && !opts.clobber)
                console.warn(`WARNING: '${item.target}' already exists and --clober is not set. Skipping...`);
            else
                fs.writeFile(item.target, content, (err) => {
                    if(err) console.error(err);
                });
        });

    });
};
