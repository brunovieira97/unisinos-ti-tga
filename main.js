const fs = require('fs'); 
const rl = require('readline-sync')

const ppm = require('compressjs').PPM;
const bwt = require('compressjs').BWTC;
const crc = require('crc').crc32;

const alice29 = './texts/alice29.txt';
const c_alice29 = "./texts/c_alice29.txt";
const sum = './texts/sum';
const c_sum = './texts/c_sum';

mainLoop();

function mainLoop(){
    switch (readOption()){
        case '0':
            console.log('Closing...');
            break;
        case '1':
            compress(true,1);
            break;
        case '2':
            decompress(true,1);
            break;
        case '3':
            compress(false,1);
            break;
        case '4':
            decompress(false,1);
            break;
        default: 
            console.log('Choose a valid option');
    }
}

function readOption(){
    return rl.question(`Options:
    1 - Encode alice29.txt
    2 - Decode alice29.txt
    3 - Enconde sum
    4 - Decode sum
    0 - Close \n`);
}

function compressPPM(originalFile,compressedFile,isAlice){
    fs.readFile(originalFile, (err,data) => {  
        const buffer =  Buffer.from(data);
        console.log(`CRC32 de ${originalFile} => ${crc(buffer.slice(0,8))}`);         
        const compressed = ppm.compressFile(buffer);
        fs.writeFile(compressedFile, compressed,'utf-8', err => {
            if (err) throw `Could not compress ${originalFile} with PPM`;
            else compress(isAlice,2);
        });
    });
}

function compressBWT(compressedFile,isAlice){
    fs.readFile(compressedFile,(err,data) => {
        const buffer =  Buffer.from(data);
        const compressed = bwt.compressFile(buffer);
        fs.writeFile(compressedFile, compressed, 'utf-8', err => {
            if (err) throw `Could not compress ${compressedFile} with BWT`;
            else compress(isAlice);
        });
    });
}

function compress(isAlice, step = 0){
    if (step == 0) return;

    const originalFile = isAlice ? alice29 : sum;
    const compressedFile = isAlice ? c_alice29 : c_sum;

    fs.stat(originalFile, function(err, stat) {
        if (err)
            throw "File not found!";
    });
    
    switch(step){
        case 1:
            compressPPM(originalFile, compressedFile,isAlice);
            break;
        case 2:
            compressBWT(compressedFile,isAlice);
            break;
    }
 }

function decompressPPM(originalFile,isAlice){
    fs.readFile(originalFile, (err,data) => {
        const decompressed = ppm.decompressFile(data);
        const result = Buffer.from(decompressed);
        fs.writeFile(originalFile, result, 'utf-8',err => {
           if (err) throw `Could not decompress ${originalFile} with PPM`;
           else 
            console.log(`CRC32 de ${originalFile} => ${crc(result.slice(0,8))}`);
            decompress(isAlice);
        });
    });
}

function decompressBWT(originalFile, compressedFile,isAlice){
    fs.readFile(compressedFile,(err,data) => {
        const decompressed = bwt.decompressFile(data);
        const result = Buffer.from(decompressed);
        fs.writeFile(originalFile, result, 'utf-8',err => {
           if (err) throw `Could not decompress ${compressedFile} with BWT`;
           else decompress(isAlice,2);
        });
    });
}

function decompress(isAlice, step = 0){
    if (step == 0) return;

    const originalFile = isAlice ? './texts/alice29(1).txt' : './texts/sum(1)';
    const compressedFile = isAlice ? c_alice29 : c_sum;

    fs.stat(compressedFile, function(err, stat) {
        if (err)
            throw "File not found!";
    });
    
    switch(step){
        case 1:
            decompressBWT(originalFile,compressedFile,isAlice);
            break;
        case 2:
            decompressPPM(originalFile,isAlice);
            break;
    }
}




