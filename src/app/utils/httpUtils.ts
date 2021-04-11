import { HttpHeaders } from "@angular/common/http";

export const getOptions = () => {
    return getHeader() ;
    /*options: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body'; */
}
export const getHeader = () => {
    let headerToAdd = new HttpHeaders().append('Access-Control-Allow-Origin','*');
    return { headers: headerToAdd , observe: 'response' as 'response'};
}