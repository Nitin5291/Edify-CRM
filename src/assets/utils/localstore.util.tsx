const localStoreUtil = {
    store_data: (key: string, data: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        }
        return false;
    },

    get_data: (key: string) => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(key);
            if (!item) {
                return false;
            } else {
                return JSON.parse(item);
            }
        }
        return false;
    },

    remove_data: (key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
            return true;
        }
        return false;
    },

    remove_all: () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
            return true;
        }
        return false;
    },
};

export default localStoreUtil;
