'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard } from "lucide-react";

const LABELS = [
  { id: 'urgent', name: 'Urgent', color: 'bg-red-500' },
  { id: 'bug', name: 'Bug', color: 'bg-yellow-500' },
  { id: 'feature', name: 'Feature', color: 'bg-green-400' },
  { id: 'enhance', name: 'Amélioration', color: 'bg-blue-400' },
];

function CardModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [labels, setLabels] = useState(card.labels || []);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [status, setStatus] = useState(card.status || "todo");

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function toggleLabel(id) {
    if (labels.includes(id)) setLabels(labels.filter(l => l !== id));
    else setLabels([...labels, id]);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 text-white p-6 rounded-lg w-1/2 transform transition-all duration-150 scale-100" onClick={(e) => e.stopPropagation()}>
        <input
          className="w-full text-2xl font-bold mb-4 bg-gray-700 p-2 rounded text-white"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          className="w-full p-2 bg-gray-700 rounded mb-4"
          rows="5"
          placeholder="Ajouter une description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="mb-4">
          <div className="text-sm text-zinc-300 mb-2">Statut :</div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded mb-3"
          >
            <option value="todo">À faire</option>
            <option value="inprogress">En cours</option>
            <option value="done">Terminé</option>
          </select>

          <div className="text-sm text-zinc-300 mb-2">Date d&apos;échéance :</div>
          <input
            type="date"
            value={dueDate ? dueDate : ''}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded mb-4"
          />

          <div className="text-sm text-zinc-300 mb-2">Labels :</div>
          <div className="flex gap-2">
            {LABELS.map((lbl) => (
              <button
                key={lbl.id}
                type="button"
                onClick={() => toggleLabel(lbl.id)}
                className={`${lbl.color} text-white px-2 py-1 rounded text-xs ${labels.includes(lbl.id) ? 'ring-2 ring-white' : 'opacity-80'}`}
              >
                {lbl.name}
              </button>
            ))}
          </div>
        </div>
          <div className="flex justify-end gap-2">
          <button
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={onClose}
          >
            Fermer
          </button>
          <button
            className={`bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 ${title.trim() === '' ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => { if (title.trim() !== '') onSave({ title, description, labels, dueDate: dueDate || null, status }); }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableListTitle({ title, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  function handleTitleChange(e) {
    setCurrentTitle(e.target.value);
  }

  function handleBlur() {
    if (currentTitle.trim().length > 0) {
      onSave(currentTitle);
    }
    setIsEditing(false);
  }

  return isEditing ? (
    <input
      className="w-[calc(100%-2rem)] text-xl font-semibold mb-2 bg-gray-700 p-2 rounded text-white"
      value={currentTitle}
      onChange={handleTitleChange}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <h2
      className="text-xl font-semibold mb-2 cursor-pointer text-white"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h2>
  );
}

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const optionRefs = useRef([]);
  const [savedAt, setSavedAt] = useState(null);

  // Load boards from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("epitrello_boards");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setBoards(parsed);
      }
    } catch (e) {
      console.error("Failed to load boards from localStorage", e);
    }
  }, []);

  // Auto-save boards to localStorage with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("epitrello_boards", JSON.stringify(boards));
        setSavedAt(new Date());
      } catch (e) {
        console.error("Failed to save boards to localStorage", e);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [boards]);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  function addBoard() {
    const title = newBoardTitle.trim();
    if (!title) return;
    setBoards([...boards, { title, cards: [] }]);
    setNewBoardTitle("");
  }

  const [newCardTitles, setNewCardTitles] = useState({});
  function addCard(boardIndex) {
    const text = (newCardTitles[boardIndex] || "").trim();
    if (!text) return;
    const newBoards = [...boards];
    if (!newBoards[boardIndex].cards) {
      newBoards[boardIndex].cards = []; // S'assurer que la liste des cartes existe
    }
    newBoards[boardIndex].cards.push({ title: text, labels: [], dueDate: null, status: 'todo' });
    setBoards(newBoards);
    setNewCardTitles({ ...newCardTitles, [boardIndex]: "" });
  }

  function deleteCard(boardIndex, cardIndex) {
    const card = boards?.[boardIndex]?.cards?.[cardIndex];
    if (!card) return;
    if (!confirm(`Supprimer la carte "${card.title}" ?`)) return;
    const newBoards = [...boards];
    if (!newBoards[boardIndex] || !newBoards[boardIndex].cards) return;
    newBoards[boardIndex].cards.splice(cardIndex, 1);
    setBoards(newBoards);
  }

  function editCard(boardIndex, cardIndex) {
    const newText = prompt("Modifier le nom de la carte :");
    if (!newText) return;
    const newBoards = [...boards];
    newBoards[boardIndex].cards[cardIndex].title = newText;
    setBoards(newBoards);
  }

  function editBoard(boardIndex) {
    const newTitle = prompt("Modifier le nom de la liste :");
    if (!newTitle) return;
    const newBoards = [...boards];
    newBoards[boardIndex].title = newTitle;
    setBoards(newBoards);
  }

  function deleteBoard(boardIndex) {
    const board = boards[boardIndex];
    if (!board) return;
    if (!confirm(`Supprimer la liste "${board.title}" et toutes ses cartes ?`)) return;
    const newBoards = boards.filter((_, index) => index !== boardIndex);
    setBoards(newBoards);
  }

  function toggleOptions(index) {
    const newBoards = boards.map((board, i) => {
      if (i === index) {
        return { ...board, showOptions: !board.showOptions };
      }
      return { ...board, showOptions: false };
    });
    setBoards(newBoards);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      optionRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          toggleOptions(index);
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boards]);

  function handleDragStart(e, boardIndex, cardIndex) {
    e.dataTransfer.setData("text/plain", `card,${boardIndex},${cardIndex}`);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleBoardDragStart(e, boardIndex) {
    e.dataTransfer.setData("text/plain", `board,${boardIndex}`);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e, boardIndex, cardIndex) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const parts = data.split(",");
    if (parts[0] === "card") {
      const fromBoardIndex = Number(parts[1]);
      const fromCardIndex = Number(parts[2]);
      if (fromBoardIndex === boardIndex && fromCardIndex === cardIndex) return;
      const newBoards = [...boards];
      const draggedCard = newBoards[fromBoardIndex].cards[fromCardIndex];
      newBoards[fromBoardIndex].cards.splice(fromCardIndex, 1);
      newBoards[boardIndex].cards.splice(cardIndex, 0, draggedCard);
      setBoards(newBoards);
    }
  }

  function handleDropOnList(e, boardIndex) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const parts = data.split(",");
    if (parts[0] === "card") {
      const fromBoardIndex = Number(parts[1]);
      const fromCardIndex = Number(parts[2]);
      const newBoards = [...boards];
      const draggedCard = newBoards[fromBoardIndex].cards[fromCardIndex];
      newBoards[fromBoardIndex].cards.splice(fromCardIndex, 1);
      if (!newBoards[boardIndex].cards) newBoards[boardIndex].cards = [];
      newBoards[boardIndex].cards.push(draggedCard);
      setBoards(newBoards);
    } else if (parts[0] === "board") {
      const fromIndex = Number(parts[1]);
      const toIndex = boardIndex;
      if (fromIndex === toIndex) return;
      const newBoards = [...boards];
      const [moved] = newBoards.splice(fromIndex, 1);
      newBoards.splice(toIndex, 0, moved);
      setBoards(newBoards);
    }
  }

  function handleBoardDrop(e, boardIndex) {
    // Delegate to handleDropOnList to handle both board and card drops
    handleDropOnList(e, boardIndex);
  }

  function handleDragEnter(e) {
    e.currentTarget.classList.add("bg-zinc-600", "border", "border-dashed", "border-white");
  }

  function handleDragLeave(e) {
    e.currentTarget.classList.remove("bg-zinc-600", "border", "border-dashed", "border-white");
  }

  function openCardModal(boardIndex, cardIndex) {
    const card = boards[boardIndex].cards[cardIndex];
    setSelectedCard({ ...card, boardIndex, cardIndex });
  }

  return (
    <div className="min-h-screen bg-zinc-700 p-6 text-white">
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <CardModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onSave={(details) => {
              const { boardIndex, cardIndex } = selectedCard;
              const newBoards = [...boards];
              newBoards[boardIndex].cards[cardIndex] = details;
              setBoards(newBoards);
              setSelectedCard(null);
            }}
          />
        </div>
      )}
      <div className={`flex items-center gap-2 text-3xl font-bold mb-6 ${selectedCard ? 'pointer-events-none' : ''}`}>
        <img src="/logo.png" alt="Epitrello logo" className="w-10 h-10" />
        <h1>Epitrello</h1>
        <div className="ml-4 text-sm text-zinc-300">
          {savedAt ? `Enregistré : ${savedAt.toLocaleTimeString()}` : "Non enregistré"}
        </div>
      </div>

      <div className={`mb-6 flex items-center gap-2 ${selectedCard ? 'pointer-events-none' : ''}`}>
        <Input
          placeholder="Nom de la nouvelle liste"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
        />
        <Button onClick={addBoard}>+ Ajouter une liste</Button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${selectedCard ? 'pointer-events-none' : ''}`}>
        {boards.map((board, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleBoardDragStart(e, index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleBoardDrop(e, index)}
          >
            <Card className="bg-zinc-800 transition-transform hover:scale-[1.01]">
            <CardContent className="p-4">
              <div className="relative">
                <EditableListTitle
                  title={board.title}
                  onSave={(newTitle) => {
                    const newBoards = [...boards];
                    newBoards[index].title = newTitle;
                    setBoards(newBoards);
                  }}
                />
                <button
                  className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-white hover:bg-gray-700 hover:text-white transition"
                  onClick={() => toggleOptions(index)}
                >
                  ...
                </button>
                {board.showOptions && (
                  <div
                    ref={(el) => (optionRefs.current[index] = el)}
                    className="absolute top-8 right-0 bg-zinc-900 text-black rounded shadow-md p-4 w-48"
                  >
                    <h3 className="text-lg font-bold mb-2 text-white">Fenêtre des options</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => addCard(index)}
                        >
                          Ajouter une carte
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => {
                            const newBoards = boards.filter((_, i) => i !== index);
                            setBoards(newBoards);
                          }}
                        >
                          Supprimer la liste
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <ul className="space-y-2 mb-4" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropOnList(e, index)}>
                {board.cards && board.cards.map((card, cIndex) => (
                  <li
                    key={cIndex}
                    className="bg-zinc-700 p-2 rounded shadow-sm flex items-center justify-between gap-2 cursor-pointer text-white hover:bg-zinc-600 hover:shadow-md transition-transform duration-150"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, cIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, cIndex)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onClick={() => openCardModal(index, cIndex)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{card.title}</div>
                      <div className="flex gap-2 mt-1">
                        {(card.labels || []).map((lid) => {
                          const lbl = LABELS.find(l => l.id === lid);
                          if (!lbl) return null;
                          return (
                            <span key={lid} className={`${lbl.color} text-white text-xs px-2 py-0.5 rounded`}>{lbl.name}</span>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      className="text-red-400 hover:text-red-600 ml-2"
                      onClick={(e) => { e.stopPropagation(); deleteCard(index, cIndex); }}
                      aria-label={`Supprimer la carte ${card.title}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Nom de la carte"
                  value={newCardTitles[index] || ""}
                  onChange={(e) => setNewCardTitles({ ...newCardTitles, [index]: e.target.value })}
                />
                <Button
                  onClick={() => addCard(index)}
                  className="mt-0 hover:bg-blue-600 hover:text-white transition"
                >
                  + Ajouter une carte
                </Button>
              </div>
            </CardContent>
              </Card>
            </div>
        ))}
      </div>
    </div>
  );
}