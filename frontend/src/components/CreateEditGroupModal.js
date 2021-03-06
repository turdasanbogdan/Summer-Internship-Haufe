import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Form,
  ListGroup,
  Card,
  Accordion,
  Alert
} from "react-bootstrap";

import { store } from "../redux/store";
import { useHttpClient } from "../hooks/http-hook";
import {
  getGroups,
  getGroup,
  editGroup,
  clearGroup,
  createGroup,
  deleteGroup
} from "../redux/actions/index";

const initialGroup = {
  name: "",
  createdBy: "404b9242-2aac-442e-a353-b1290f3eb1bc",
  claims: [],
  advancedSettings: []
};
const initialErrors = {
  name: false,
  claim: { empty: false, exists: false },
  setting: { empty: false, exists: false }
};

function CreateEditGroupModal({
  id,
  getGroup,
  getGroups,
  editGroup,
  clearGroup,
  createGroup,
  currentGroup,
  deleteGroup
}) {
  const [modalShow, setModalShow] = useState(false);
  const [currentClaim, setCurrentClaim] = useState("");
  const [currentSetting, setCurrentSetting] = useState({
    key: "",
    value: ""
  });
  const [group, setGroup] = useState(initialGroup);
  const [errors, setErrors] = useState(initialErrors);
  const createOrEditText = id
    ? { header: "Edit Group", button1: "Edit group", button2: "Save" }
    : {
        header: "Provide information for the new group",
        button1: "Create group",
        button2: "Create"
      };

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    if (modalShow && currentGroup && id === currentGroup.id) {
      setGroup(currentGroup);
    }
  }, [currentGroup, modalShow, id]);

  useEffect(() => {
    if (id && modalShow) {
      getGroup(id, sendRequest);
    }
  }, [modalShow, id, getGroup, sendRequest]);

  // Modal display helpers
  const handleClose = () => {
    clearGroup();
    setCurrentClaim("");
    setCurrentSetting({ key: "", value: "" });
    setGroup(initialGroup);
    setErrors(initialErrors);
    setModalShow(false);
  };
  const handleShow = () => {
    setModalShow(true);
  };

  // Form Control helpers
  const handleClaim = () => {
    let fieldExists = false;
    if (currentClaim === "") {
      setErrors({ ...errors, claim: { empty: true, exists: false } });
      return;
    }
    group.claims.forEach((claim) => {
      if (claim.claim) {
        if (claim.claim === currentClaim) {
          fieldExists = true;
          return;
        }
      } else {
        if (claim === currentClaim) {
          fieldExists = true;
          return;
        }
      }
    });
    if (fieldExists) {
      setErrors({ ...errors, claim: { empty: false, exists: true } });
      setCurrentClaim("");
      return;
    }
    setErrors({ ...errors, claim: { empty: false, exists: false } });
    handleChange({
      target: { name: "claims", value: currentClaim }
    });
    setCurrentClaim("");
  };

  const handleSetting = () => {
    let fieldExists = false;
    if (currentSetting.key === "" || currentSetting.value === "") {
      setErrors({ ...errors, setting: { empty: true, exists: false } });
      return;
    }
    group.advancedSettings.forEach((setting) => {
      if (currentSetting.key === setting.key) {
        fieldExists = true;
        return;
      }
    });
    if (fieldExists) {
      setErrors({ ...errors, setting: { empty: false, exists: true } });
      setCurrentSetting({ key: "", value: "" });
      return;
    }
    setErrors({ ...errors, setting: { empty: false, exists: false } });
    handleChange({
      target: { name: "advancedSettings", value: currentSetting }
    });
    setCurrentSetting({ key: "", value: "" });
  };

  const deleteClaim = (event) => {
    let newMapping = group.claims.filter((claim) => {
      if (claim.claim) {
        return claim.claim !== event.target.value;
      } else {
        return claim !== event.target.value;
      }
    });
    setGroup({ ...group, claims: newMapping });
  };

  const deleteSetting = (event) => {
    let newSettings = group.advancedSettings.filter((setting) => {
      return setting.key !== event.target.value;
    });
    setGroup({ ...group, advancedSettings: newSettings });
  };

  // Handling change to the state of the input
  function handleChange({ target }) {
    if (target.name === "name") {
      setErrors({ ...errors, name: false });
      setGroup({ ...group, [target.name]: target.value });
    } else {
      setGroup({
        ...group,
        [target.name]: [...group[target.name], target.value]
      });
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (group.name === "") {
      setErrors({ ...errors, name: true });
      return;
    }
    if (!id) {
      createGroup(group, sendRequest);
    } else {
      let parsedGroup = group;
      parsedGroup.claims = parsedGroup.claims.map((claim) =>
        claim.id ? claim.claim : claim
      );
      editGroup(parsedGroup, sendRequest);
    }
    const unsubscribe = store.subscribe(() => {
      unsubscribe();
      getGroups(sendRequest);
      handleClose();
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    if (id) {
      deleteGroup(id, sendRequest);
      const unsubscribe = store.subscribe(() => {
        unsubscribe();
        getGroups(sendRequest);
        handleClose();
      });
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {createOrEditText.button1}
      </Button>

      <Modal
        onHide={handleClose}
        show={modalShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {createOrEditText.header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* ======= NAME INPUT COMPONENTS ======= */}
            <Form.Group controlId="name">
              <Form.Label className="font-weight-bold">
                <div>Name</div>
              </Form.Label>
              <Form.Control
                onChange={handleChange}
                name="name"
                type="text"
                placeholder="Enter a name"
                value={group.name}
                isInvalid={errors.name}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a group name
              </Form.Control.Feedback>
            </Form.Group>
            <Accordion>
              {/* Claims */}
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    <div className="font-weight-bold">Claims to group</div>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Form.Group controlId="claimsToGroupMapping">
                      <InputGroup className="mb-3">
                        <FormControl
                          name="claimsToGroupMapping"
                          type="text"
                          placeholder="Add a claim"
                          value={currentClaim}
                          onChange={(event) =>
                            setCurrentClaim(event.target.value.trim())
                          }
                          isInvalid={errors.claim.empty || errors.claim.exists}
                        />
                        <InputGroup.Append>
                          <Button
                            name="claimsToGroupMapping"
                            variant="outline-success"
                            onClick={handleClaim}
                          >
                            Add the claim
                          </Button>
                        </InputGroup.Append>
                        <Form.Control.Feedback type="invalid">
                          {errors.claim.empty ? (
                            <span>Please provide a value</span>
                          ) : (
                            <span>Claim with this name exists</span>
                          )}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center">
                      {group.claims.length === 0 ? (
                        <Alert variant="danger">No claims added yet</Alert>
                      ) : (
                        <ListGroup>
                          {group.claims.map((claim) => (
                            <ListGroup.Item
                              key={claim.id ? claim.id : claim}
                              className="d-flex"
                            >
                              <span className="p-2">
                                {claim.claim ? claim.claim : claim}
                              </span>
                              <Button
                                variant="outline-danger"
                                className="ml-auto p-2"
                                size="sm"
                                value={claim.claim ? claim.claim : claim}
                                onClick={deleteClaim}
                              >
                                Delete
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              {/* Settings */}
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    <div className="font-weight-bold">
                      Default settings and flags
                    </div>
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <Form.Group>
                      <InputGroup className="mb-3">
                        <FormControl
                          name="key"
                          type="text"
                          placeholder="Add a key"
                          value={currentSetting.key}
                          onChange={(event) =>
                            setCurrentSetting({
                              ...currentSetting,
                              [event.target.name]: event.target.value.trim()
                            })
                          }
                          isInvalid={
                            errors.setting.empty || errors.setting.exists
                          }
                        />
                        <FormControl
                          name="value"
                          type="text"
                          placeholder="Add a value"
                          value={currentSetting.value}
                          onChange={(event) =>
                            setCurrentSetting({
                              ...currentSetting,
                              [event.target.name]: event.target.value.trim()
                            })
                          }
                          isInvalid={
                            errors.setting.empty || errors.setting.exists
                          }
                        />
                        <InputGroup.Append>
                          <Button
                            name="advancedSettings"
                            variant="outline-success"
                            onClick={handleSetting}
                          >
                            Add the setting
                          </Button>
                        </InputGroup.Append>
                        <Form.Control.Feedback type="invalid">
                          {errors.setting.empty ? (
                            <span>Please provide a key and a value</span>
                          ) : (
                            <span>Setting with this key exists</span>
                          )}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center">
                      {group.advancedSettings.length === 0 ? (
                        <Alert variant="danger">
                          No setting or flags added yet
                        </Alert>
                      ) : (
                        <ListGroup>
                          {group.advancedSettings.map((setting) => (
                            <ListGroup.Item
                              key={setting.key}
                              className="d-flex"
                            >
                              <span className="p-2">
                                {setting.key} - {setting.value}
                              </span>
                              <Button
                                variant="outline-danger"
                                className="ml-auto p-2"
                                size="sm"
                                value={setting.key}
                                onClick={deleteSetting}
                              >
                                Delete
                              </Button>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Form.Group>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <Modal.Footer>
              <Button onClick={handleClose} className="btn btn-secondary">
                Close
              </Button>
              {id ? (
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete
                </Button>
              ) : (
                <></>
              )}
              <Button type="submit" className="btn btn-primary">
                {createOrEditText.button2}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return { currentGroup: state.group };
};

export default connect(mapStateToProps, {
  getGroups,
  getGroup,
  editGroup,
  clearGroup,
  createGroup,
  deleteGroup
})(CreateEditGroupModal);
