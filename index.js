const api =
  "https://gist.githubusercontent.com/f/e45b086fd1644bca0ca8771aea0a88da/raw/5b4d913d6d11c896018cb3d0f79aab5f6adce8a0/5-harfliler.json";
let words = [];
let filteredWords = [];
const status = ["absent", "present", "correct"];
const alpabet = "abcçdefgğhıijklmnoöprsştuüvyz";
let filteredAlpabet = alpabet;
let arrRegex = new Array(5);

fetch(api)
  .then((res) => res.json())
  .then((json) => {
    words = json;
    document.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        run();
      }
    });
  });

function run() {
  const arrRow = [];
  // document.querySelector('game-app').shadowRoot.querySelectorAll('#board game-row')[0].shadowRoot.querySelectorAll('game-tile')[0].getAttribute('letter');
  const rows = document
    .querySelector("game-app")
    .shadowRoot.querySelectorAll("#board game-row");
  Array.from(rows).forEach((row) => {
    const letters = row.getAttribute("letters");
    if (letters) {
      const arrColumn = [];
      Array.from(row.shadowRoot.querySelectorAll("game-tile")).forEach(
        (column) => {
          const letter = column.getAttribute("letter");
          const evaluation = column.getAttribute("evaluation");
          const reveal = column.getAttribute("reveal");
          if (reveal != null) {
            arrColumn.push({ letter, evaluation });
            if (evaluation == "absent") {
              filteredAlpabet = filteredAlpabet.replace(letter, "");
            }
          } else {
            arrColumn.push({});
          }
        }
      );
      arrRow.push(arrColumn);
    } else {
      arrRow.push([]);
    }
  });
  arrRegex.fill(filteredAlpabet);

  for (const row of arrRow) {
    if (row.length) {
      for (const [i, column] of row.entries()) {
        if (column.evaluation == "present") {
          arrRegex[i] = arrRegex[i].replace(column.letter, "");
        } else if (column.evaluation == "correct") {
          arrRegex[i] = column.letter;
        }
      }
    }
  }

  arrRegex = arrRegex.map((item) => `[${item}]`);
  const reg = new RegExp(arrRegex.join(""), "gi");
  const filteredWords = words.filter((item) => reg.test(item));
  console.log(filteredWords);
}
