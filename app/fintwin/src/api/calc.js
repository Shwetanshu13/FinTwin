import { requestJsonAuthed } from "./http";

export async function calcProfile({ asOfDate } = {}) {
    return requestJsonAuthed("/calc/profile", {
        method: "POST",
        body: { asOfDate: asOfDate || undefined },
    });
}

export async function calcRunway({ asOfDate } = {}) {
    return requestJsonAuthed("/calc/runway", {
        method: "POST",
        body: { asOfDate: asOfDate || undefined },
    });
}

export async function calcSavings({ asOfDate } = {}) {
    return requestJsonAuthed("/calc/savings", {
        method: "POST",
        body: { asOfDate: asOfDate || undefined },
    });
}

export async function calcOneTimePurchase({ asOfDate, purchaseAmount } = {}) {
    return requestJsonAuthed("/calc/purchase/one-time", {
        method: "POST",
        body: {
            asOfDate: asOfDate || undefined,
            purchaseAmount,
        },
    });
}

export async function calcEmiPurchase({ asOfDate, emiAmount, emiTenureMonths } = {}) {
    return requestJsonAuthed("/calc/purchase/emi", {
        method: "POST",
        body: {
            asOfDate: asOfDate || undefined,
            emiAmount,
            emiTenureMonths,
        },
    });
}
