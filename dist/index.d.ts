declare class TwilioMediaStreamSaveAudioFile {
    private saveLocation;
    private saveFilename;
    private onSaved;
    private writeStream;
    private websocket;
    constructor(options: {
        saveLocation?: string;
        saveFilename?: string | number;
        onSaved?: () => void;
    });
    get filename(): string;
    get writeStreamPath(): string;
    twilioStreamStart(): void;
    setWebsocket(websocket: any): void;
    twilioStreamMedia(mediaPayload: string): void;
    twilioStreamStop(): void;
}
export default TwilioMediaStreamSaveAudioFile;
