const express = require("express");
const { Op } = require("sequelize");
const models = require("../database/models");

const getClients = async (req, res) => {
  let clients;
  try {
    clients = await models.Client.findAll({
      include: [
        models.AdvancedSettingClient,
        models.AttributeMapping,
        models.Metadata,
        models.ClientStatus
      ]
    });

    return res.status(200).json({ clients });
  } catch (err) {
    console.log(err);
  }
};

const createClient = async (req, res) => {
  const newClient = {
    ...req.body,
    creationDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    lastModifiedBy: req.body.createdBy
  };

  try {
    console.log(newClient);
    const result = await models.Client.create(newClient, {
      include: [
        models.AdvancedSettingClient,
        models.AttributeMapping
        // models.Metadata
      ]
    });
    return res.status(200).json({ client: result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await models.Client.findByPk(req.params.clientId, {
      include: [
        models.AdvancedSettingClient,
        models.AttributeMapping,
        models.Metadata,
        models.ClientStatus
      ]
    });
    return res.status(200).json({ client });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

const updateClient = async (req, res) => {
  res.status(400).json({ message: "updated client" });
};

const deleteClient = async (req, res) => {
  const clientId = req.params.groupId;
  try {
    const client = await models.Client.findByPk(clientId);
    if (client) {
      await client.destroy();
      return res.status(200).json({ message: "deleted client", id: clientId });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

const addStatus = async (req, res) => {
  res.status(400).json({ message: "added client status" });
};

const addMetadata = async (req, res) => {
  res.status(400).json({ message: "added metadata for client" });
};

const getAllMetadata = async (req, res) => {
  res.status(400).json({ message: "got all metadata for client" });
};

const getMetadata = async (req, res) => {
  res.status(400).json({ message: "got metadata by id for client " });
};

const updateMetadata = async (req, res) => {
  res.status(400).json({ message: "updated medatada" });
};

const deleteMetadata = async (req, res) => {
  res.status(400).json({ message: "deleted metadata" });
};

exports.getClients = getClients;
exports.createClient = createClient;
exports.getClientById = getClientById;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.addStatus = addStatus;
exports.addMetadata = addMetadata;
exports.getAllMetadata = getAllMetadata;
exports.getMetadata = getMetadata;
exports.updateMetadata = updateMetadata;
exports.deleteMetadata = deleteMetadata;