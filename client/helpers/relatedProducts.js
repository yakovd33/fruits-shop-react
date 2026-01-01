const getProductId = (item) => item?._id || item?.id || item?.numberId || item?.numberID || item?.sku || null;

const getItemCategory = (item) => item?.category || item?.category_id || item?.categoryId || item?.categoryID;

export const getRelatedProducts = (pool = [], targetProduct, limit = 8) => {
    if (!targetProduct || !Array.isArray(pool) || !pool.length) {
        return [];
    }

    const targetId = getProductId(targetProduct);
    const targetCategory = getItemCategory(targetProduct);
    const uniqueCandidates = [];
    const seenIds = new Set();

    const pushUnique = (item) => {
        const candidateId = getProductId(item);
        if (!candidateId || seenIds.has(candidateId) || candidateId === targetId) {
            return;
        }
        seenIds.add(candidateId);
        uniqueCandidates.push(item);
    };

    const sanitizedPool = pool.filter(Boolean);

    if (targetCategory) {
        sanitizedPool
            .filter((item) => getItemCategory(item) === targetCategory)
            .forEach(pushUnique);
    }

    sanitizedPool.forEach(pushUnique);

    return uniqueCandidates.slice(0, limit);
};
