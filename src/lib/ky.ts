import ky from "ky";

const kyInstance = ky.create({
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value); // Convert string 'created at' value to a Date object
      return value;
    }),
});

export default kyInstance;
