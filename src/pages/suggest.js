import Cookies from "js-cookie";


export function openSuggestForm() {
    const jwtDataString = Cookies.get("jwtData");
    if (jwtDataString != null) {
        const jwtDataObject = JSON.parse(jwtDataString);
        console.log(jwtDataObject);

        let campus = "";
        if (!!jwtDataObject && !!jwtDataObject.userRole && !!jwtDataObject.userRole.campus) {
            campus = jwtDataObject.userRole.campus;
        }

        let suggestFormLink = "";
        if (campus === "Lehi") {
            suggestFormLink = "https://forms.office.com/Pages/ResponsePage.aspx?id=3haQp9C9R06R9HlBarkSrY0kCgVKXFBBvm4JiuJtur5UMkdGQU5BVzNTRThHWlZIR1JCR1Q2RVQ4Vy4u";
        }
        else if (campus === "Salt Lake City") {
            suggestFormLink = "https://forms.office.com/Pages/ResponsePage.aspx?id=3haQp9C9R06R9HlBarkSrY0kCgVKXFBBvm4JiuJtur5UNTI1UE9ZSUs0RVZQMjQ0UTlEUVhRVFNCUy4u";
        }
        else {
            console.assert(false, "Unknown campus");
        }

        if (suggestFormLink) {
            window.open(suggestFormLink, "_blank");
        }
    }
}
