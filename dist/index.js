"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class TwilioMediaStreamSaveAudioFile {
    constructor(options) {
        this.writeStream = null;
        this.saveLocation = options.saveLocation || __dirname;
        this.saveFilename = options.saveFilename || Date.now();
        this.onSaved = options.onSaved || null;
    }
    get filename() {
        return `${this.saveFilename}.wav`;
    }
    get writeStreamPath() {
        return `${this.saveLocation}/${this.filename}`;
    }
    twilioStreamStart() {
        this.writeStream = (0, fs_1.createWriteStream)(this.writeStreamPath, {
            encoding: 'binary',
        });
        // Mu-law header for a WAV file compatible with Twilio format
        this.writeStream.write(Buffer.from([
            0x52,
            0x49,
            0x46,
            0x46,
            0x62,
            0xb8,
            0x00,
            0x00,
            0x57,
            0x41,
            0x56,
            0x45,
            0x66,
            0x6d,
            0x74,
            0x20,
            0x12,
            0x00,
            0x00,
            0x00,
            0x07,
            0x00,
            0x01,
            0x00,
            0x40,
            0x1f,
            0x00,
            0x00,
            0x80,
            0x3e,
            0x00,
            0x00,
            0x02,
            0x00,
            0x04,
            0x00,
            0x00,
            0x00,
            0x66,
            0x61,
            0x63,
            0x74,
            0x04,
            0x00,
            0x00,
            0x00,
            0xc5,
            0x5b,
            0x00,
            0x00,
            0x64,
            0x61,
            0x74,
            0x61,
            0x00,
            0x00,
            0x00,
            0x00, // Last 4 bytes are the data length
        ]));
    }
    // @deprecated
    setWebsocket(websocket) {
        this.websocket = websocket;
    }
    twilioStreamMedia(mediaPayload) {
        if (this.writeStream) {
            this.writeStream.write(Buffer.from(mediaPayload, 'base64'));
        }
    }
    twilioStreamStop() {
        if (this.writeStream) {
            this.writeStream.write('', () => {
                const fd = (0, fs_1.openSync)(this.writeStream.path, 'r+');
                let count = this.writeStream.bytesWritten;
                count -= 58; // Subtract header length to get data byte length
                (0, fs_1.writeSync)(fd, Buffer.from([
                    count % 256,
                    (count >> 8) % 256,
                    (count >> 16) % 256,
                    (count >> 24) % 256,
                ]), 0, 4, // Write 4 bytes
                54 // Start writing at byte 54 in the file
                );
                if (this.onSaved) {
                    this.onSaved();
                }
            });
        }
    }
}
exports.default = TwilioMediaStreamSaveAudioFile;
//# sourceMappingURL=index.js.map