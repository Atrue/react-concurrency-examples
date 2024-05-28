import { Router } from "express";
import countriesJson from "./contries.json" assert { type: "json" };
import cardsJson from "./cards.json" assert { type: "json" };
import { CountryApiResponse } from "../src/types/country";
import { CardShort } from "../src/types/card";

const DELAY_OPTIONS = [500, 1000];
let delayIndex = 0;

const router = Router();

// @README
// imitate server delay to catch concurrency issues
router.use((req, res, next) => {
  delayIndex = (delayIndex + 1) % DELAY_OPTIONS.length;
  const currentDelay = DELAY_OPTIONS[delayIndex];
  setTimeout(next, currentDelay);
});

router.get("/country/search", (req, res) => {
  const name = `${req.query.name || ""}`.toLowerCase();
  const skip = +(req.query.skip || 0) || 0;
  const filtered = countriesJson.filter((country) =>
    country.name.toLowerCase().includes(name)
  );
  const data: CountryApiResponse = {
    content: filtered.slice(skip, skip + 10),
    total: filtered.length,
    hasNext: skip + 10 < filtered.length,
    skip,
  };
  res.send(data);
});

router.get("/cards", (req, res) => {
  const cards: CardShort[] = cardsJson.map(({ id, name }) => ({ id, name }));
  res.send(cards);
});

router.get("/card/:id", (req, res) => {
  const { id } = req.params;
  const cardJson = cardsJson.find((card) => card.id === id);
  if (!cardJson) {
    return res.status(404).send("Not found");
  }
  const { comments, ...card } = cardJson;

  res.send(card);
});

router.get("/card/:id/comments", (req, res) => {
  const { id } = req.params;
  const cardJson = cardsJson.find((card) => card.id === id);
  if (!cardJson) {
    return res.status(404).send("Not found");
  }

  res.send(cardJson.comments);
});

export default router;
