import { Router } from "express";
import { complexAdd, complexDel, complexUpd, getComplex, getComplexById } from "../services/complexes.services";

export const complex = Router();

complex.post("/complex/add", async (req, res) => {
    try {
      const id = await complexAdd(req.body);
      res.send(id);
    } catch (err) {
      res.status(400).send(err);
    }
  });

complex.get("/complex/all", async (req, res) => {
  const obj = await getComplex();
  res.send(obj);
});

complex.get("/complex/:id", async (req, res) => {
    const obj = await getComplexById(req.params, req.body);
    res.send(obj);
});

complex.patch("/complex/upd/:id", async (req, res) => {
    const obj = await complexUpd(req.params, req.body);
    res.send(obj);
});

complex.patch("/complex/del/:id", async (req, res) => {
    const obj = await complexDel(req.params, req.body);
    res.send(obj);
});
