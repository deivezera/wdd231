const params = new URLSearchParams(window.location.search);

const submittedFields = {
    outFirstName: "firstName",
    outLastName: "lastName",
    outEmail: "email",
    outPhone: "phone",
    outOrganization: "organization",
    outTimestamp: "timestamp",
};

Object.entries(submittedFields).forEach(([elementId, paramName]) => {
    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    const value = params.get(paramName);
    element.textContent = value && value.trim() !== "" ? value : "Not provided";
});
