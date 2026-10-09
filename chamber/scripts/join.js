const timestampField = document.querySelector("#timestamp");

if (timestampField) {
    timestampField.value = new Date().toLocaleString();
}

const dialogButtons = document.querySelectorAll("[data-dialog]");

dialogButtons.forEach((button) => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (!dialog) {
        return;
    }

    button.addEventListener("click", () => {
        dialog.showModal();
    });

    const closeButton = dialog.querySelector(".modal-close");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            dialog.close();
        });
    }

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});
