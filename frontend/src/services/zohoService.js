import api from "./api";

export const getPeople = async () => {
    const response = await api.get("/zoho/people");
    return response.data;
};

export const getCRM = async () => {
    const response = await api.get("/zoho/crm");
    return response.data;
};

export const getDesk = async () => {
    const response = await api.get("/zoho/desk");
    return response.data;
};

export const getBooks = async () => {
    const response = await api.get("/zoho/books");
    return response.data;
};