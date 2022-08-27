#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import * as child from 'child_process';

const projectName = process.argv[2];
const projectPath = path.join(__dirname, `../${projectName}`);

if (!projectName) {
    console.log('\n❌ You must provide a project name.\n');
    process.exit(1);
}

if (fs.existsSync(projectPath)) {
    console.log(`\n❌ Project "${projectName}" already exists at: ${projectPath}\n`);
    process.exit(1);
}

// Make required directories (project dir, src dir, dist dir)
fs.mkdirSync(projectPath);
fs.mkdirSync(projectPath + '/src');
fs.mkdirSync(projectPath + '/dist');
console.log('\n✅ Created required directories')

// Copy the default package.json and tsconfig.json files to the new dir
const defaultPackage = path.join(__dirname, './defaults/package.json');
const defaultTSConfig = path.join(__dirname, './defaults/tsconfig.json');
fs.copyFileSync(defaultPackage, projectPath + '/package.json');
fs.copyFileSync(defaultTSConfig, projectPath + '/tsconfig.json');
console.log('✅ Copied default project files')

// Make an empty main.ts file
const mainFilePath = projectPath + '/src/main.ts';
fs.writeFileSync(mainFilePath, '');

// Replace the "name" in package.json with the project's name
const parsedPackage = JSON.parse(fs.readFileSync(projectPath + '/package.json').toString());
parsedPackage.name = projectName;
fs.writeFileSync(projectPath + '/package.json', JSON.stringify(parsedPackage, null, 3));
console.log('✅ Updated package.json')

// If the second arg is "web," create additional directories/files
if (process.argv[3] && process.argv[3] == 'web') {
    fs.mkdirSync(projectPath + '/views');
    fs.mkdirSync(projectPath + '/views/layouts');
    fs.mkdirSync(projectPath + '/views/partials');
    fs.mkdirSync(projectPath + '/static');
    fs.mkdirSync(projectPath + '/static/css');
    fs.mkdirSync(projectPath + '/static/scss');
    fs.mkdirSync(projectPath + '/static/js');
    fs.mkdirSync(projectPath + '/static/img');
    fs.writeFileSync(projectPath + '/views/index.liquid', '');
    fs.writeFileSync(projectPath + '/static/scss/main.scss', '');
    console.log('✅ Created views and static directories (web)');

    // Create a child process to install packages.
    // Installs: Express, ioredis, liquidjs, body-parser,
    // cookie-parser, bcrypt (and type declarations).
    const packages = ['express', 'ioredis', 'liquidjs', 'body-parser', 'cookie-parser', 'bcrypt'];
    child.spawnSync('npm', ['install', ...packages], {
        cwd: projectPath
    });
    console.log('✅ Installed commonly used webdev libraries');
    
    // Declarations are installed as dev dependencies
    const decs = ['@types/express', '@types/ioredis', '@types/body-parser', '@types/cookie-parser', '@types/bcrypt'];
    child.spawnSync('npm', ['install', '-D', ...decs], {
        cwd: projectPath
    });
    console.log('✅ ...and the associated type declarations');
} else {
    // Otherwise, we'll still want the node types
    child.spawnSync('npm', ['install', '-D', '@types/node'], {
        cwd: projectPath
    });
    console.log('✅ Installed Node.js type definitions');
}

console.log(`\n👍 Created new project "${projectName}" at:`, projectPath);
console.log('Remember to install all necessary npm packages!\n');