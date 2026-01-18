
export type Carrier = 'Dialog' | 'Mobitel' | 'Hutch' | 'Airtel' | 'Unknown';

export const getCarrier = (phoneNumber: string): Carrier => {
    // Remove non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check for Sri Lankan length (9 digits without 0, or 10 with 0)
    // We'll focus on the prefix (first 3 digits after initial 0, or first 2 if no 0)

    let prefix = '';
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        prefix = cleaned.substring(1, 3);
    } else if (cleaned.length === 9) {
        prefix = cleaned.substring(0, 2);
    } else {
        return 'Unknown';
    }

    // Carrier Prefixes
    // Dialog: 077, 076, 074
    // Mobitel: 071, 070
    // Hutch: 078, 072
    // Airtel: 075

    const p = parseInt(prefix);

    if ([77, 76, 74].includes(p)) return 'Dialog';
    if ([71, 70].includes(p)) return 'Mobitel';
    if ([78, 72].includes(p)) return 'Hutch';
    if ([75].includes(p)) return 'Airtel';

    return 'Unknown';
};

export const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10 && cleaned.startsWith('0')) return cleaned;
    if (cleaned.length === 9) return `0${cleaned}`;
    return phoneNumber; // Return original if pattern doesn't match roughly
}

export const isValidSLNumber = (phoneNumber: string): boolean => {
    const carrier = getCarrier(phoneNumber);
    const cleaned = phoneNumber.replace(/\D/g, '');
    return carrier !== 'Unknown' && (cleaned.length === 9 || (cleaned.length === 10 && cleaned.startsWith('0')));
}

// Simple Base64 SVGs for reliable display
export const carrierLogos: Record<Carrier, string> = {
    Dialog: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNTAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNkMjEwMzQiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+RGlhbG9nPC90ZXh0Pjwvc3ZnPg==",
    Mobitel: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNTAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiMwMDgwMDAiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TW9iaXRlbDwvdGV4dD48L3N2Zz4=",
    Hutch: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNTAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmZDY2MDAiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SHV0Y2g8L3RleHQ+PC9zdmc+",
    Airtel: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgNTAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNlMjFiMjQiLz48dGV4dCB4PSI1MCIgeT0iMzUiIGZvbnQtc2l6ZT0iMjgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+YWlydGVsPC90ZXh0Pjwvc3ZnPg==",
    Unknown: ""
}
