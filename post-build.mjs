// Import necessary modules
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// Define __dirname using import.meta.url for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get the application name
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const productName = packageJson.name; // Adjust according to your package.json structure

// Define the AppImage file name using values from package.json
const appImageName = `${productName}.AppImage`;

// Define the path to the generated AppImage and the path to the desktop
const outputDirectory = path.join(__dirname, 'dist'); // Adjust this path if necessary
const appImagePath = path.join(outputDirectory, appImageName);
const desktopPath = path.join(os.homedir(), 'Desktop', appImageName);

console.log(`#### AppImage generated at: ${appImagePath}`);

// Copy the AppImage file to the desktop
fs.copyFile(appImagePath, desktopPath, (err) => {
    if (err) {
        console.error('Error copying the AppImage file:', err);
        return;
    }
    console.log(`AppImage copied to: ${desktopPath}`);

    // Grant execute permissions to the copied file
    exec(`chmod +x "${desktopPath}"`, (error) => {
        if (error) {
            console.error('Error granting execute permissions:', error);
        } else {
            console.log('Execute permissions granted to the AppImage on the desktop.');
        }
    });
});
