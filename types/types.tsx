export interface adminKeyDoc {
    date: string;
    key: string;
    emailSent: string;
    timeSentLOC: string;
    timeSentUTC: string;
    timeUsedLOC: string | null;
    timeUsedUTC: string | null;
    localKey: string | null;
}
