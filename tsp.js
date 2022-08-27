#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child = __importStar(require("child_process"));
const projectName = process.argv[2];
const projectPath = path_1.default.join(__dirname, `../${projectName}`);
if (!projectName) {
    console.log('\n❌ You must provide a project name.\n');
    process.exit(1);
}
if (fs_1.default.existsSync(projectPath)) {
    console.log(`\n❌ Project "${projectName}" already exists at: ${projectPath}\n`);
    process.exit(1);
}
// Make required directories (project dir, src dir, dist dir)
fs_1.default.mkdirSync(projectPath);
fs_1.default.mkdirSync(projectPath + '/src');
fs_1.default.mkdirSync(projectPath + '/dist');
console.log('\n✅ Created required directories');
// Copy the default package.json and tsconfig.json files to the new dir
const defaultPackage = path_1.default.join(__dirname, './defaults/package.json');
const defaultTSConfig = path_1.default.join(__dirname, './defaults/tsconfig.json');
fs_1.default.copyFileSync(defaultPackage, projectPath + '/package.json');
fs_1.default.copyFileSync(defaultTSConfig, projectPath + '/tsconfig.json');
console.log('✅ Copied default project files');
// Make an empty main.ts file
const mainFilePath = projectPath + '/src/main.ts';
fs_1.default.writeFileSync(mainFilePath, '');
// Replace the "name" in package.json with the project's name
const parsedPackage = JSON.parse(fs_1.default.readFileSync(projectPath + '/package.json').toString());
parsedPackage.name = projectName;
fs_1.default.writeFileSync(projectPath + '/package.json', JSON.stringify(parsedPackage, null, 3));
console.log('✅ Updated package.json');
// If the second arg is "web," create additional directories/files
if (process.argv[3] && process.argv[3] == 'web') {
    fs_1.default.mkdirSync(projectPath + '/views');
    fs_1.default.mkdirSync(projectPath + '/views/layouts');
    fs_1.default.mkdirSync(projectPath + '/views/partials');
    fs_1.default.mkdirSync(projectPath + '/static');
    fs_1.default.mkdirSync(projectPath + '/static/css');
    fs_1.default.mkdirSync(projectPath + '/static/scss');
    fs_1.default.mkdirSync(projectPath + '/static/js');
    fs_1.default.mkdirSync(projectPath + '/static/img');
    fs_1.default.writeFileSync(projectPath + '/views/index.liquid', '');
    fs_1.default.writeFileSync(projectPath + '/static/scss/main.scss', '');
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
}
else {
    // Otherwise, we'll still want the node types
    child.spawnSync('npm', ['install', '@types/node']);
    console.log('✅ Installed Node.js type definitions');
}
console.log(`\n👍 Created new project "${projectName}" at:`, projectPath);
console.log('Remember to install all necessary npm packages!\n');
