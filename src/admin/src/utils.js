export const cleanDateString = (dateString) =>
  dateString ? dateString.replace(" 00:00:00 GMT", "") : dateString;

// React 17 broke UI Kit modals. They're still worth using I think,
// Just need this shim to open them
export const openModal = (target) => {
  console.log(target);
  // let modal = document.querySelector(target);
  // // let options = JSON.parse(modal.dataset["ukModal"].replace(/'/g, '"') || "");
  // let current = document.querySelector(".uk-modal.uk-open");

  // if (current !== null) {
  //   console.log(current);
  //   current.dispatchEvent(new CustomEvent("close"));
  // }

  // modal.classList.add("uk-open");
  // modal.style.display = "block";

  // let close = (e) => {
  //   modal.dispatchEvent(new CustomEvent("close"));
  // };

  // let stop = (e) => {
  //   e.stopPropagation();
  // };

  // // if (options["bg-close"]) {
  // modal.querySelector(".uk-modal-body").addEventListener("click", stop);
  // modal.addEventListener("click", close);
  // // }

  // modal.querySelector(".uk-modal-close").addEventListener("click", close);
  // modal.addEventListener("close", (e) => {
  //   console.log("Closing:", e);
  //   modal.classList.remove("uk-open");

  //   setTimeout(() => {
  //     modal.style.display = "none";
  //   }, 100);

  //   modal.querySelector(".uk-modal-body").removeEventListener("click", stop);
  //   modal.removeEventListener("click", close);
  //   modal.querySelector(".uk-modal-close").removeEventListener("click", close);
  // });
};
