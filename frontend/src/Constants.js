const prod = {
    url: {
        API_HOST: "",
        get API_URL() {
            return "" + this.API_HOST;
        }
    }
};
const dev = {
    url: {
        API_HOST: "localhost:8000",
        get API_URL() {
            return "http://" + this.API_HOST;
        }
    }
};
export const config = process.env.NODE_ENV === "development" ? dev : prod;