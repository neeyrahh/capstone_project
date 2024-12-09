import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import "../styles/Tasks.css";
import { API_BASE_URL } from "./Config";
import { FaEye } from 'react-icons/fa';

const LIST_CONFIG = [
  { ListID: 1, Name: "To Do", position: 1 },
  { ListID: 2, Name: "In Progress", position: 2 },
  { ListID: 3, Name: "Completed", position: 3 },
  { ListID: 4, Name: "Approved", position: 4 },
];

const Tasks = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [lists, setLists] = useState(
    LIST_CONFIG.map((list) => ({ ...list, cards: [] }))
  );
  const [boardMembers, setBoardMembers] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBoardMembers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/board-members/${boardId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch board members");
      }

      const data = await response.json();

      if (data && Array.isArray(data.board_members)) {
        setBoardMembers(data.board_members);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      setModalError("Failed to load board members");
    }
  }, [boardId]);

  const fetchBoardDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/board/${boardId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch board details");
      }

      const data = await response.json();
      setBoardName(data.board.name);
    } catch (err) {
      setError("Failed to load board details");
    }
  }, [boardId]);

  const fetchCards = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${boardId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }

      const groupedCards = await response.json();

      console.log("Grouped Cards from Backend:", groupedCards); // Debugging log

      const updatedLists = LIST_CONFIG.map((list) => ({
        ...list,
        cards: groupedCards[list.position] || [],
      }));

      console.log("Updated Lists:", updatedLists); // Debugging log

      setLists(updatedLists);
    } catch (err) {
      setError("Failed to load cards");
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([
          fetchBoardDetails(),
          fetchCards(),
          fetchBoardMembers(),
        ]);
      } catch (err) {
        setError("Failed to load board data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    isAuthenticated,
    navigate,
    fetchBoardDetails,
    fetchCards,
    fetchBoardMembers,
  ]);
  // working drag and drop

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // Cancel if dropped outside a valid droppable area or in the same position
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      console.log(
        "Drag operation canceled or item dropped in the same position."
      );
      return;
    }

    const sourceListIndex = lists.findIndex(
      (list) => list.ListID === parseInt(source.droppableId)
    );
    const destListIndex = lists.findIndex(
      (list) => list.ListID === parseInt(destination.droppableId)
    );

    const sourceList = lists[sourceListIndex];
    const destList = lists[destListIndex];

    const draggedCard = sourceList.cards[source.index];

    if (!draggedCard) {
      console.error("Dragged card not found in source list.");
      return;
    }

    console.log("Dragged Card:", draggedCard);
    console.log("Source List:", sourceList);
    console.log("Destination List:", destList);

    // Optimistic UI update
    const updatedSourceCards = [...sourceList.cards];
    updatedSourceCards.splice(source.index, 1); // Remove the card from source

    const updatedDestCards = [...destList.cards];
    updatedDestCards.splice(destination.index, 0, draggedCard); // Add card to destination

    const updatedLists = lists.map((list, index) => {
      if (index === sourceListIndex) {
        return { ...list, cards: updatedSourceCards };
      }
      if (index === destListIndex) {
        return { ...list, cards: updatedDestCards };
      }
      return list;
    });

    setLists(updatedLists);

    // Send updated position to the backend
    try {
      const newPosition = destList.position; // Map to the destination list's position
      const response = await fetch(`${API_BASE_URL}/cards/update-position`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: draggedCard._id,
          newPosition: newPosition, // Use position from the LIST_CONFIG
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update card position on the backend.");
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      // Update the UI based on the backend response
      const updatedCard = data.card;
      setLists((prevLists) =>
        prevLists.map((list) => {
          // Remove the card from all lists
          const filteredCards = list.cards.filter(
            (card) => card._id !== updatedCard._id
          );

          // If this is the destination list, add the updated card
          if (list.ListID === parseInt(destination.droppableId)) {
            filteredCards.splice(destination.index, 0, updatedCard);
          }

          return { ...list, cards: filteredCards };
        })
      );
    } catch (err) {
      console.error("Error updating card position:", err);
      alert("Failed to update card position. Please try again.");

      // Revert the optimistic UI update in case of error
      setLists(lists);
    }
  };

  const handleAddCard = () => {
    navigate(`/tasks/${boardId}/add`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail("");
    setModalError("");
    setSuccess("");
  };

  const handleShowModal = async () => {
    setModalError("");
    setSuccess("");
    try {
      await fetchBoardMembers();
      setShowModal(true);
    } catch (err) {
      setModalError("Failed to load board members for invite modal");
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setModalError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/board-member/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Member invited successfully!");
        await fetchBoardMembers();
        setEmail("");
      } else {
        throw new Error(data.msg || "Failed to invite member");
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading board data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="tasks-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{boardName} - Tasks Board</h4>
        <Button
          type="submit"
          onClick={handleShowModal}
          className="btn invite-members"
        >
          + Invite Member
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <DragDropContext
        onDragEnd={handleDragEnd}
        onDragStart={(result) => console.log("Drag Started: ", result)}
        onDragUpdate={(result) => console.log("Drag Updated: ", result)}
      >
        <Row className="gx-3">
          {lists.map((list) => (
            <Col key={list.ListID} md={3} className="mb-4">
              <Droppable droppableId={list.ListID.toString()} type="TASK">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`task-list ${
                      snapshot.isDraggingOver ? "dragging-over" : ""
                    }`}
                  >
                    <h5 className="list-title text-center mb-3">
                      {list.Name}
                      <span className="badge bg-secondary ms-2">
                        {list.cards.length}
                      </span>
                    </h5>
                    {list.cards.map((card, index) => (
                      <Draggable
                        key={card._id}
                        draggableId={card._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card-container ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                          >
                            <Card className="task-card mb-3 shadow-sm">
                              <Card.Body>
                                <div className="card-heading">
                                <Card.Title>{card.title}</Card.Title>
                                <FaEye className="task-icon"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    navigate(`/task/${boardId}/${card._id}`)
                                  }
                                >
                                  {" "}
                                  View{" "}
                                </FaEye>
                                </div>
                                <Card.Text>
                                  <small>
                                    <strong>Assigned to: </strong>
                                    {boardMembers.find(
                                      (m) => m.user_id === card.assign_to
                                    )?.email || card.assign_to}
                                  </small>
                                  <br />
                                  <small>
                                    <strong>Due Date: </strong>
                                    {new Date(
                                      card.dueDate
                                    ).toLocaleDateString()}
                                  </small>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button
                      variant="outline-secondary"
                      className="w-100 mt-2 add-card-btn"
                      onClick={handleAddCard}
                    >
                      + Add a card
                    </Button>
                  </div>
                )}
              </Droppable>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Invite Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleInviteMember}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter the email address of the person you want to invite.
              </Form.Text>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </Form>

          {boardMembers.length > 0 && (
            <div className="mt-4">
              <h6>Current Board Members:</h6>
              <ul className="list-unstyled">
                {boardMembers.map((member) => (
                  <li key={member.user_id} className="text-muted">
                    {member.email || member.user_id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;


// fixed invite members bug