export const copyToClipboard = (text, name) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            // Optional: Show a success message to the user
            console.log(`Copied ${name} to clipboard: ${text}`);
        })
        .catch((error) => {
            console.error("Error copying to clipboard:", error);
        });
    }


export const shortAddress = (address) => {
  try {
    return (
      address.substring(0, 4) +
      "..." +
      address.substring(address.length - 4, address.length) +
      "  "
    );
  } catch (e) {
    console.log(e.message);
  }
};