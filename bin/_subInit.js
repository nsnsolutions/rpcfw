'use strict';

const tryRequire = require('./_tryRequire');
const packageJson = require('../package.json');
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
            pattern: /^v[0-9]+\.[0-9]+\.[0-9]$/,
            message: "RPCLib Version should look something like v0.0.0",
            default: "v" + packageJson.version,
            required: true
        },
        DOCKER_REGISTRY: {
            description: "Docker Repository",
            pattern: /^[a-zA-Z0-9\.\_\-]+$/,
            message: "This must be a valid hostname.",
            required: false
        },
        DOCKER_IMAGE: {
            description: "Docker Iamge Name",
            pattern: /^[a-z0-9\.\_]+$/,
            message: "Can only contain lowercase characters, numbers, dots, and underscores.",
            require: false
        }
    }
}

module.exports = function Init(opts) {
    var template_dir = path.join( __dirname, "..", "assets"),
        working_dir = path.normalize(process.cwd(), opts.working_dir),
        templateLoader = null,
        templateEngine = null,
        outputs = [
            { name: "Dockerfile",   target: path.join(working_dir, "Dockerfile")     },
            { name: "README.md",    target: path.join(working_dir, "README.md")      },
            { name: "Service.yml",  target: path.join(working_dir, "Service.yml")    },
            { name: "src/main.js",  target: path.join(working_dir, 'src', "main.js") },
            { name: "package.json", target: path.join(working_dir, "package.json")   }
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
