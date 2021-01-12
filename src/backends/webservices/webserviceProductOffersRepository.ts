import {Pool} from "../../framework/postgres";
import CryptoJS from 'crypto-js';
import Condition from "../../productoffers/productConditions";

export enum PaymentIntervalCode {
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    HALF_YEARLY = "halfYearly",
    YEARLY = "yearly"
}

export enum BackgroundStyle {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY"
}

export interface Document {
    documentId: string,
    documentTitle: string,
    documentType: string
}

export interface Lock {
    priceRanges: LockPriceRange[]
}

type LockPriceRange = Range & { requiredLockPrice: bigint }

export interface Range {
    minClose: number,
    maxOpen: number
}

export interface SupportedDevice {
    objectCode: string,
    objectCodeExternal: string,
    maxPriceLimitation?: number,
    intervals: SupportedPaymentInterval[]
}

export interface SupportedPaymentInterval {
    intervalCode: string,
    description: string,
    priceRangePremiums: PriceRangePremiums[]
}

export type PriceRangePremiums = Range & { insurancePremium: number, condition: Condition }

export interface WebservicesProduct {
    name: string,
    shortName: string,
    id: string,
    productType: string,
    applicationCode: string,
    risks: string[];
    clientId: string,
    defaultPaymentInterval: PaymentIntervalCode,
    productImageLink: string,
    backgroundStyle: BackgroundStyle,
    documents: Document[],
    advantages: string[],
    lock: Lock,
    devices: SupportedDevice[]
}

export async function persist(productOffers: WebservicesProduct[]): Promise<WebservicesProduct[] | undefined> {
    if (!productOffers || productOffers.length === 0) {
        return [];
    }
    const pool = Pool.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const hash = hashProductOffers(productOffers);
        if (await productOffersExists(productOffers[0].clientId, hash, client)) {
            return productOffers;
        }
        const query = {
            name: 'insert-product-offers',
            text: `INSERT INTO productoffers (clientid, hash, productoffers) VALUES ($1 , $2, $3)
                    ON CONFLICT (clientId)
                    DO UPDATE SET hash = $2, productoffers = $3`,
            values: [
                productOffers[0].clientId,
                hash,
                JSON.stringify(productOffers)
            ]
        };
        await client.query(query);
        await client.query('COMMIT');
        return await findByClientId(productOffers[0].clientId);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function findByClientId(clientId: string): Promise<WebservicesProduct[] | undefined> {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-product-offers-by-client-id',
        text: `SELECT productoffers FROM productoffers  
               WHERE clientid = $1`,
        values: [clientId]
    });
    if (result.rowCount > 0) {
        return result.rows[0].productoffers;
    } else {
        return undefined;
    }
}

export async function findById(productOfferId: string): Promise<WebservicesProduct | undefined> {
    const pool = Pool.getInstance();
    const result = await pool.query({
        name: 'find-product-offer-by-id',
        text: `SELECT * FROM (SELECT jsonb_array_elements(p.productoffers) as offer FROM productoffers p) po WHERE  po.offer ->> 'id' = $1`,
        values: [productOfferId]
    });
    if (result.rowCount > 0) {
        return result.rows[0].offer;
    } else {
        return undefined;
    }
}

async function productOffersExists(clientId: string, hash: string, pool = Pool.getInstance()): Promise<boolean> {
    const result = await pool.query({
        name: 'find-product-offers-by-client-id-and-hash',
        text: `SELECT productoffers FROM productoffers  
               WHERE clientid = $1
               AND hash = $2`,
        values: [clientId, hash]
    });
    return result.rowCount > 0;
}

function hashProductOffers(productOffers: WebservicesProduct[]): string {
    const relevantOfferParts = productOffers.map(offer => {
        return {
            documents: offer.documents,
            advantages: offer.advantages,
            devices: offer.devices,
            lock: offer.lock,
            backgroundStyle: offer.backgroundStyle,
            productImageLink: offer.productImageLink,
            shortName: offer.shortName
        };
    });

    const asString = JSON.stringify(relevantOfferParts);
    return CryptoJS.SHA1(asString).toString();
}
