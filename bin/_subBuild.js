'use strict';

const tryRequire = require('./_tryRequire');
const rpclib = require('../lib');
const splash = require('./_splash')
const path = require('path');
const childProcess = require('child_process');
const async = tryRequire('async');
const AWS = tryRequire('aws-sdk');

module.exports = function Build(opts) {

    var configPath = path.resolve(process.cwd(), opts.config),
        ecr = new AWS.ECR({ region: opts.aws_region }),
        name, version, image, tasks = [],
        srvConfig = rpclib.serviceConfiguration(configPath, {
            format: opts.fmt,
            encoding: opts.encoding 
        });

    assertValid(srvConfig);
    splash(srvConfig, null);

    // Consolidate the details about the image and its name
    name = srvConfig.serviceDescription.name;
    version = srvConfig.serviceDescription.version.toString();
    image = srvConfig.containerDescription.image;

    // Install tasks
    tasks.push(loadImageTags);
    tasks.push(loadImageTags);
    tasks.push(findTag);
    tasks.push(buildImage);
    if(opts.push)
        tasks.push(pushImage);

    async.waterfall(tasks, (e, d) => {
        if(e) throw { name: "Error", message: e.message || e.errorMessage }
        console.log(`\nNew image name: ${state.imageName}`);
    });

    // ------------------------------------------------------------------------

    var state = {}

    function loadImageTags(done) {
        ecr.listImages({ repositoryName: image }, (e, m) => {
            state.ecrResult = m;
            done(e);
        });
    }

    function findTag(done) {
        var maxNum = 0;

        state.ecrResult.imageIds.forEach((image) => {
            var imageTag = image.imageTag;

            if(imageTag.startsWith(`${name}.v${version}`)) {
                var tagStruct = imageTag.split('-');
                if (tagStruct.length > 0) {
                    var buildNumber = Number(tagStruct.splice(-1, 1)[0]);
                    if(buildNumber > maxNum) maxNum = buildNumber;
                }
            }
        });

        state.imageName = srvConfig.containerDescription.toString(`${name}.v${version}-${++maxNum}`);
        done();
    }

    function buildImage(done) {
        var cp = childProcess.spawn('docker', [
            'build', '-f', opts.docker_file,
            '-t', state.imageName, opts.working_dir 
        ]);

        showIo(cp);

        cp.on('close', (code) => {
            if(code == 0)
                done()
            else
                done({ message: "Failed to build docker image." });
        });
    }

    function pushImage(done) {
        var cp = childProcess.spawn('docker', [ 'push', state.imageName ]);

        showIo(cp);

        cp.on('close', (code) => {
            if(code == 0)
                done()
            else
                done({ message: "Failed to push docker image." });
        });
    }

    function assertValid(srvConfig) {
        if(!srvConfig.serviceDescription.isValid())
            throw { name: "ConfigError",
                    message: srvConfig.serviceDescription.errorMessage }
        if(!srvConfig.containerDescription.isValid())
            throw { name: "ConfigError",
                    message: srvConfig.containerDescription.errorMessage }
        if(childProcess.spawnSync('docker', [ '--version' ]).stdout === null)
            throw { name: "ConfigError",
                    message: "Unable to run docker. Is it instealled?" }
    }

    function showIo(p) {
        p.stdout.on('data', (data) => process.stdout.write(data));
        p.stderr.on('data', (data) => process.stdout.write(data));
    }
};
