'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutDashboard, DownloadCloud, UploadCloud, Save, X, Settings, Trash2, Plus } from "lucide-react";

const LABELS = [
  { id: 'urgent', name: 'Urgent', color: 'bg-red-500' },
  { id: 'bug', name: 'Bug', color: 'bg-yellow-500' },
  { id: 'feature', name: 'Feature', color: 'bg-green-400' },
  { id: 'enhance', name: 'Amélioration', color: 'bg-blue-400' },
];

function LabelsManagementModal({ labels, onClose, onSave }) {
  const [editingId, setEditingId] = useState(null);
  const [editingColor, setEditingColor] = useState(null);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#a855f7");

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : hex;
  }

  function addLabel() {
    if (!newLabelName.trim()) return;
    const newId = `label_${Date.now()}`;
    const updated = [...labels, { id: newId, name: newLabelName, color: newLabelColor, isCustom: true }];
    onSave(updated);
    setNewLabelName("");
    setNewLabelColor("#a855f7");
  }

  function updateLabel(id, name, color) {
    const updated = labels.map(l => l.id === id ? { ...l, name, color } : l);
    onSave(updated);
    setEditingId(null);
    setEditingColor(null);
  }

  function deleteLabel(id) {
    const updated = labels.filter(l => l.id !== id);
    onSave(updated);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-xl w-1/2 max-h-96 overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold mb-6">Gérer les labels</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Labels existants</h3>
          <div className="space-y-2 mb-4">
            {labels.map((lbl) => (
              <div key={lbl.id} className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition">
                {editingId === lbl.id ? (
                  <>
                    <input
                      type="text"
                      value={lbl.name}
                      onChange={(e) => {
                        const updated = labels.map(l => l.id === lbl.id ? { ...l, name: e.target.value } : l);
                        onSave(updated);
                      }}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 focus:bg-slate-500 px-3 py-2 rounded-lg text-white focus:outline-none transition border border-slate-500 focus:border-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingColor && editingColor.startsWith('#') ? editingColor : lbl.color}
                        onChange={(e) => setEditingColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-slate-500 hover:border-slate-400 transition"
                        title="Choisir une couleur"
                      />
                      <span className="text-xs text-gray-400">{editingColor || lbl.color}</span>
                    </div>
                    <button 
                      onClick={() => updateLabel(lbl.id, lbl.name, editingColor || lbl.color)} 
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
                    >
                      OK
                    </button>
                  </>
                ) : (
                  <>
                    <div 
                      className="w-6 h-6 rounded-lg shadow" 
                      style={{ backgroundColor: lbl.color.startsWith('#') ? lbl.color : lbl.color }} 
                    />
                    <span className="flex-1 text-sm font-medium">{lbl.name}</span>
                    <button 
                      onClick={() => { setEditingId(lbl.id); setEditingColor(lbl.color); }} 
                      className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm transition"
                    >
                      Éditer
                    </button>
                    {lbl.isCustom && (
                      <button 
                        onClick={() => deleteLabel(lbl.id)} 
                        className="px-3 py-1 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Ajouter un label</h3>
          <div className="space-y-4">
            <input
              placeholder="Nom du label"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              className="w-full bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition border border-slate-600 focus:border-blue-500"
            />
            <div className="flex items-center gap-3 bg-slate-700 p-4 rounded-lg">
              <label className="text-sm font-semibold text-gray-300">Couleur:</label>
              <input
                type="color"
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
                className="w-14 h-14 rounded-lg cursor-pointer border-2 border-slate-500 hover:border-slate-400 transition"
                title="Cliquer pour choisir une couleur"
              />
              <div 
                className="flex-1 h-10 rounded-lg border border-slate-600 shadow"
                style={{ backgroundColor: newLabelColor }}
                title="Aperçu"
              />
              <span className="text-sm text-gray-300 font-mono">{newLabelColor}</span>
            </div>
            <button 
              onClick={addLabel} 
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function CardModal({ card, onClose, onSave, availableLabels }) {
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

  const statusLabels = {
    todo: "À faire",
    inprogress: "En cours",
    done: "Terminé",
    archived: "Archivé"
  };

  const statusColors = {
    todo: "bg-slate-500",
    inprogress: "bg-blue-500",
    done: "bg-green-500",
    archived: "bg-gray-600"
  };

  const statusIcons = {
    todo: "○",
    inprogress: "⟳",
    done: "✓",
    archived: "📦"
  };

  // Check if due date is overdue
  function isOverdue() {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateObj = new Date(dueDate);
    return dueDateObj < today && status !== 'done' && status !== 'archived';
  }

  // Format date for display
  function formatDate(dateStr) {
    if (!dateStr) return "Aucune date";
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Days until due
  function daysUntilDue() {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateObj = new Date(dueDate);
    const diff = Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Notification Overdue */}
        {isOverdue() && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center gap-2">
            <span className="text-red-400 font-bold">⚠</span>
            <span className="text-red-300 text-sm font-medium">Date dépassée depuis {Math.abs(daysUntilDue())} jour(s)</span>
          </div>
        )}

        {/* En-tête avec titre et statut */}
        <div className="flex items-center justify-between mb-6">
          <input
            className="flex-1 text-3xl font-bold bg-transparent border-b-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none transition px-2 py-1"
            value={title}
            onChange={handleTitleChange}
            placeholder="Titre de la carte"
          />
          <div className={`${statusColors[status]} text-white px-4 py-2 rounded-full text-sm font-semibold ml-4 flex items-center gap-2`}>
            <span>{statusIcons[status]}</span>
            {statusLabels[status]}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Description</label>
          <textarea
            className="w-full p-3 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-white placeholder-gray-400"
            rows="3"
            placeholder="Ajouter une description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Grille pour Statut et Date */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Statut */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-white cursor-pointer text-sm"
            >
              <option value="todo">À faire</option>
              <option value="inprogress">En cours</option>
              <option value="done">Terminé</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          {/* Date d'échéance */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">Date d&apos;échéance</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dueDate ? dueDate : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 p-2 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition text-white cursor-pointer text-sm"
              />
              {dueDate && (
                <button
                  onClick={() => setDueDate('')}
                  className="px-2 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg transition text-sm"
                  title="Effacer la date"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Date informatif */}
        {dueDate && (
          <div className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${isOverdue() ? 'bg-red-900/30 border border-red-500/50' : daysUntilDue() <= 3 ? 'bg-yellow-900/30 border border-yellow-500/50' : 'bg-slate-700'}`}>
            <span className={isOverdue() ? 'text-red-300' : daysUntilDue() <= 3 ? 'text-yellow-300' : 'text-gray-300'}>
              📅 {formatDate(dueDate)}
            </span>
            <span className={`font-semibold ${isOverdue() ? 'text-red-400' : daysUntilDue() <= 3 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {isOverdue() ? `${Math.abs(daysUntilDue())}j en retard` : daysUntilDue() === 0 ? 'Aujourd\'hui!' : `${daysUntilDue()}j restants`}
            </span>
          </div>
        )}

        {/* Labels */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-300 mb-2 block">Labels</label>
          <div className="flex gap-2 flex-wrap bg-slate-700 p-3 rounded-lg">
            {availableLabels.map((lbl) => (
              <button
                key={lbl.id}
                type="button"
                onClick={() => toggleLabel(lbl.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition transform hover:scale-105 ${labels.includes(lbl.id) ? 'ring-2 ring-white shadow-lg' : 'opacity-60 hover:opacity-80'}`}
                style={{ backgroundColor: lbl.color.startsWith('#') ? lbl.color : lbl.color }}
              >
                {lbl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition ${title.trim() === '' ? 'opacity-50 cursor-not-allowed bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
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
  const [allLabels, setAllLabels] = useState(LABELS);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [selectedLabelFilters, setSelectedLabelFilters] = useState([]);
  const optionRefs = useRef([]);
  const fileInputRef = useRef(null);
  const [savedAt, setSavedAt] = useState(null);
  const [draggedCardInfo, setDraggedCardInfo] = useState(null);
  const [dropTargetInfo, setDropTargetInfo] = useState(null);
  const [listDropTarget, setListDropTarget] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDeadlineCalendar, setShowDeadlineCalendar] = useState(false);
  
  // Advanced search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  
  // User/assignee system
  const [currentUser, setCurrentUser] = useState('Utilisateur 1');
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState(['Utilisateur 1', 'Utilisateur 2', 'Utilisateur 3']);
  
  // History tracking
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      // Load user
      const savedUser = localStorage.getItem('epitrello_user');
      if (savedUser) setCurrentUser(savedUser);
      
      // Load users list
      const savedUsers = localStorage.getItem('epitrello_users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      
      // Load history
      const savedHistory = localStorage.getItem('epitrello_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      
      const raw = localStorage.getItem("epitrello_boards");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setBoards(parsed);
      }
      const rawLabels = localStorage.getItem("epitrello_labels");
      if (rawLabels) {
        const parsedLabels = JSON.parse(rawLabels);
        if (Array.isArray(parsedLabels)) {
          // Ensure base labels are always present with their correct structure
          const baseLabelsMap = new Map(LABELS.map(l => [l.id, l]));
          const mergedLabels = parsedLabels.map(l => {
            // If it's a base label, use the LABELS definition to ensure correct structure
            if (baseLabelsMap.has(l.id)) {
              return baseLabelsMap.get(l.id);
            }
            return l;
          });
          // Add any missing base labels
          LABELS.forEach(baseLabel => {
            if (!mergedLabels.find(l => l.id === baseLabel.id)) {
              mergedLabels.unshift(baseLabel);
            }
          });
          setAllLabels(mergedLabels);
        }
      } else {
        // If no labels saved, initialize with base labels
        setAllLabels(LABELS);
      }
    } catch (e) {
      console.error("Failed to load from localStorage", e);
      setAllLabels(LABELS);
    }
  }, []);

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

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem("epitrello_labels", JSON.stringify(allLabels));
      } catch (e) {
        console.error("Failed to save labels to localStorage", e);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [allLabels]);

  useEffect(() => {
    try {
      localStorage.setItem("epitrello_users", JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users", e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem("epitrello_user", currentUser);
    } catch (e) {
      console.error("Failed to save current user", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("epitrello_history", JSON.stringify(history.slice(-100))); // Keep last 100 actions
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, [history]);

  // Add action to history
  function addToHistory(action, details) {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: currentUser,
      action,
      details,
    };
    setHistory(prev => [...prev, newEntry]);
  }

  // Check for overdue cards and generate notifications
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueCards = [];

    boards.forEach((board, boardIdx) => {
      board.cards?.forEach((card, cardIdx) => {
        if (!card.dueDate || card.status === 'done' || card.status === 'archived') return;
        const dueDate = new Date(card.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        if (dueDate < today) {
          const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          overdueCards.push({
            id: `${boardIdx}-${cardIdx}`,
            title: card.title,
            boardTitle: board.title,
            daysOverdue,
            boardIndex: boardIdx,
            cardIndex: cardIdx,
          });
        }
      });
    });

    if (overdueCards.length > 0) {
      setNotifications(overdueCards.slice(0, 5)); // Limiter à 5 notifications
    }
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
      newBoards[boardIndex].cards = [];
    }
    const newCard = {
      title: text,
      labels: [],
      dueDate: null,
      status: 'todo',
      assignedTo: currentUser,
      description: '',
      createdAt: new Date().toISOString(),
    };
    newBoards[boardIndex].cards.push(newCard);
    setBoards(newBoards);
    addToHistory('create_card', { title: text, board: newBoards[boardIndex].title });
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
    addToHistory('delete_card', { title: card.title, board: newBoards[boardIndex].title });
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

  function cloneBoards(data) {
    return data.map((board) => ({
      ...board,
      cards: Array.isArray(board.cards) ? [...board.cards] : [],
    }));
  }

  function moveCardBetweenBoards({
    fromBoardIndex,
    fromCardIndex,
    toBoardIndex,
    targetCardIndex = null,
    position = 'after',
  }) {
    console.log('moveCardBetweenBoards called', { fromBoardIndex, fromCardIndex, toBoardIndex, targetCardIndex, position });
    
    if (fromBoardIndex === undefined || fromCardIndex === undefined || toBoardIndex === undefined) {
      console.warn('Missing indices');
      return;
    }

    const newBoards = cloneBoards(boards);
    if (!newBoards[fromBoardIndex]?.cards?.[fromCardIndex]) {
      console.warn('Source card not found');
      return;
    }
    if (!newBoards[toBoardIndex]?.cards) {
      console.warn('Target board not found');
      return;
    }

    // Extract the card
    const draggedCard = newBoards[fromBoardIndex].cards[fromCardIndex];
    newBoards[fromBoardIndex].cards.splice(fromCardIndex, 1);

    const targetCards = newBoards[toBoardIndex].cards;
    let insertionIndex = targetCards.length; // default: append

    if (targetCardIndex !== null && targetCardIndex !== undefined) {
      insertionIndex = targetCardIndex;
      if (position === 'after') {
        insertionIndex += 1;
      }
      // If moving within same list, adjust for removal
      if (fromBoardIndex === toBoardIndex && fromCardIndex < insertionIndex) {
        insertionIndex -= 1;
      }
    }

    // Clamp insertion index
    insertionIndex = Math.max(0, Math.min(insertionIndex, targetCards.length));

    targetCards.splice(insertionIndex, 0, draggedCard);
    console.log('Card moved to index', insertionIndex, 'in board', toBoardIndex);
    setBoards(newBoards);
  }

  function handleDragStart(e, boardIndex, cardIndex) {
    const card = boards[boardIndex]?.cards?.[cardIndex];
    if (!card) return;
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: 'card', boardIndex, cardIndex, cardId: card.id }));
    e.dataTransfer.effectAllowed = "move";
    setDraggedCardInfo({ boardIndex, cardIndex });
    setDropTargetInfo(null);
    setListDropTarget(null);
  }

  function handleBoardDragStart(e, boardIndex) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: 'board', boardIndex }));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedCardInfo(null);
    setDropTargetInfo(null);
    setListDropTarget(null);
  }

  function handleDragOverCard(e, boardIndex, cardIndex) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const position = offset < rect.height / 2 ? "before" : "after";
    setDropTargetInfo({ boardIndex, cardIndex, position });
    setListDropTarget(boardIndex);
    console.log('Over card', { boardIndex, cardIndex, position });
  }

  function handleCardDragLeave(e, boardIndex, cardIndex) {
    const related = e.relatedTarget;
    if (!related || !e.currentTarget.contains(related)) {
      setDropTargetInfo((prev) => {
        if (prev && prev.boardIndex === boardIndex && prev.cardIndex === cardIndex) {
          return null;
        }
        return prev;
      });
    }
  }

  function handleDragEnterList(e, boardIndex) {
    e.preventDefault();
    setListDropTarget(boardIndex);
    setDropTargetInfo(null);
  }

  function handleDragOverList(e, boardIndex) {
    e.preventDefault();
    setListDropTarget(boardIndex);
  }

  function handleDragLeaveList(e, boardIndex) {
    const related = e.relatedTarget;
    if (!related || !e.currentTarget.contains(related)) {
      setListDropTarget((prev) => (prev === boardIndex ? null : prev));
    }
  }

  function handleDrop(e, boardIndex, cardIndex) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.type === "card") {
        const fromBoardIndex = data.boardIndex;
        const fromCardIndex = data.cardIndex;
        
        if (fromBoardIndex === boardIndex && fromCardIndex === cardIndex) {
          console.log('Same card, ignoring');
          return;
        }

        const position = dropTargetInfo?.position || 'after';
        console.log('handleDrop on card', { fromBoardIndex, fromCardIndex, toBoardIndex: boardIndex, targetCardIndex: cardIndex, position });

        moveCardBetweenBoards({
          fromBoardIndex,
          fromCardIndex,
          toBoardIndex: boardIndex,
          targetCardIndex: cardIndex,
          position,
        });
      }
    } catch (err) {
      console.error('Drop error', err);
    }
    setDropTargetInfo(null);
    setListDropTarget(null);
    setDraggedCardInfo(null);
  }

  function handleDropOnList(e, boardIndex) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.type === "card") {
        const fromBoardIndex = data.boardIndex;
        const fromCardIndex = data.cardIndex;
        
        // Use dropTargetInfo if available (dropped on a specific card)
        let targetCardIndex = null;
        let position = 'after';
        
        if (dropTargetInfo && dropTargetInfo.boardIndex === boardIndex) {
          targetCardIndex = dropTargetInfo.cardIndex;
          position = dropTargetInfo.position;
          console.log('Drop on list with target card', { targetCardIndex, position });
        } else {
          console.log('Drop on empty area of list, appending');
        }

        moveCardBetweenBoards({
          fromBoardIndex,
          fromCardIndex,
          toBoardIndex: boardIndex,
          targetCardIndex,
          position,
        });
      } else if (data.type === "board") {
        const fromIndex = data.boardIndex;
        const toIndex = boardIndex;
        if (fromIndex === toIndex) return;
        const newBoards = [...boards];
        const [moved] = newBoards.splice(fromIndex, 1);
        newBoards.splice(toIndex, 0, moved);
        setBoards(newBoards);
      }
    } catch (err) {
      console.error('DropOnList error', err);
    }
    setDropTargetInfo(null);
    setListDropTarget(null);
    setDraggedCardInfo(null);
  }

  function handleBoardDrop(e, boardIndex) {
    e.stopPropagation();
    handleDropOnList(e, boardIndex);
  }

  function openCardModal(boardIndex, cardIndex) {
    const card = boards[boardIndex].cards[cardIndex];
    setSelectedCard({ ...card, boardIndex, cardIndex });
  }

  // Compute deadline calendar data
  function getDeadlinesByDate() {
    const deadlineMap = {};
    boards.forEach((board, boardIdx) => {
      board.cards?.forEach((card) => {
        if (!card.dueDate || card.status === 'archived') return;
        if (!deadlineMap[card.dueDate]) {
          deadlineMap[card.dueDate] = [];
        }
        deadlineMap[card.dueDate].push({
          title: card.title,
          status: card.status,
          boardTitle: board.title,
        });
      });
    });
    return deadlineMap;
  }

  function getDaysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  }

  // Export current boards as JSON file for user download
  function exportData() {
    try {
      const data = JSON.stringify(boards, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `epitrello_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Erreur lors de l’export des données. Voir la console pour détails.');
    }
  }

  function triggerImportFile() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleImportFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) {
          alert('Fichier invalide: format attendu JSON array de listes.');
          return;
        }
        setBoards(parsed);
        // save immediately
        try { localStorage.setItem('epitrello_boards', JSON.stringify(parsed)); setSavedAt(new Date()); } catch (e) { console.error(e); }
        alert('Importation réussie.');
      } catch (err) {
        console.error('Import error', err);
        alert('Erreur lors de la lecture du fichier JSON. Vérifie le format.');
      }
    };
    reader.onerror = () => { alert('Impossible de lire le fichier.'); };
    reader.readAsText(f);
    // clear value so same file can be reselected
    e.target.value = '';
  }

  function saveNow() {
    try {
      localStorage.setItem('epitrello_boards', JSON.stringify(boards));
      setSavedAt(new Date());
      alert('Sauvegarde effectuée.');
    } catch (e) {
      console.error('Save failed', e);
      alert('Erreur lors de la sauvegarde manuelle. Voir la console pour plus d\'infos.');
    }
  }

  // Advanced search and filter function
  function advancedSearch(cards) {
    return cards.filter(card => {
      // Search query (title, description, labels)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesDesc = (card.description || "").toLowerCase().includes(query);
        const matchesLabels = (card.labels || []).some(lid => {
          const label = allLabels.find(l => l.id === lid);
          return label && label.name.toLowerCase().includes(query);
        });
        if (!matchesTitle && !matchesDesc && !matchesLabels) return false;
      }

      // Status filter
      if (filterStatus && card.status !== filterStatus) return false;

      // Label filters (OR logic)
      if (selectedLabelFilters.length > 0) {
        const cardLabels = card.labels || [];
        if (!selectedLabelFilters.some(filterLabel => cardLabels.includes(filterLabel))) {
          return false;
        }
      }

      // Date range filter
      if (filterDateRange) {
        if (!card.dueDate) return false;
        const dueDate = new Date(card.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filterDateRange === 'overdue') {
          if (dueDate >= today || card.status === 'done') return false;
        } else if (filterDateRange === 'today') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (dueDate.getTime() !== today.getTime()) return false;
        } else if (filterDateRange === 'week') {
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          if (dueDate < today || dueDate > weekEnd) return false;
        } else if (filterDateRange === 'nodate') {
          if (card.dueDate) return false;
        }
      }

      // Assignee filter
      if (card.assignedTo && card.assignedTo !== currentUser && filterStatus) {
        // Only filter by assignee if explicitly set (not implemented in this simple version)
      }

      return true;
    });
  }

  // Filter cards based on selected label filters (OR logic: show if any selected label matches)
  function filterCards(cards) {
    if (selectedLabelFilters.length === 0 && !searchQuery && !filterStatus && !filterDateRange) {
      return cards;
    }
    return advancedSearch(cards);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white">
      {showLabelsModal && (
        <LabelsManagementModal
          labels={allLabels}
          onClose={() => setShowLabelsModal(false)}
          onSave={setAllLabels}
        />
      )}
      
      {/* Deadline Calendar Modal */}
      {showDeadlineCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-600">
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold">📅 Calendrier des échéances</h2>
              <button
                onClick={() => setShowDeadlineCalendar(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 transition text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const deadlineMap = getDeadlinesByDate();
                const sortedDates = Object.keys(deadlineMap).sort();
                
                if (sortedDates.length === 0) {
                  return <p className="text-gray-400 text-center py-8">Aucune échéance prévue</p>;
                }

                return sortedDates.map((dateStr) => {
                  const daysUntil = getDaysUntil(dateStr);
                  const cards = deadlineMap[dateStr];
                  const dueDate = new Date(dateStr);
                  const isOverdue = daysUntil < 0;
                  const isToday = daysUntil === 0;
                  const isSoon = daysUntil > 0 && daysUntil <= 3;

                  let dateClass = 'bg-slate-700 border-slate-600';
                  let dateLabelClass = 'text-gray-300';
                  if (isOverdue) {
                    dateClass = 'bg-red-900/30 border-red-500/50';
                    dateLabelClass = 'text-red-300';
                  } else if (isToday) {
                    dateClass = 'bg-yellow-900/30 border-yellow-500/50';
                    dateLabelClass = 'text-yellow-300';
                  } else if (isSoon) {
                    dateClass = 'bg-orange-900/30 border-orange-500/50';
                    dateLabelClass = 'text-orange-300';
                  }

                  return (
                    <div key={dateStr} className={`border ${dateClass} rounded-lg p-4`}>
                      <div className={`font-semibold text-lg mb-3 ${dateLabelClass}`}>
                        {dueDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {isOverdue && ` (Retard: ${Math.abs(daysUntil)}j)`}
                        {isToday && ' (Aujourd\'hui)'}
                        {isSoon && ` (J-${daysUntil})`}
                      </div>
                      <div className="space-y-2">
                        {cards.map((card, idx) => (
                          <div key={idx} className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{card.title}</p>
                              <p className="text-xs text-gray-400">{card.boardTitle}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                              card.status === 'done' ? 'bg-green-600 text-white' :
                              card.status === 'inprogress' ? 'bg-blue-600 text-white' :
                              'bg-slate-500 text-white'
                            }`}>
                              {card.status === 'done' ? '✓ Terminé' : card.status === 'inprogress' ? '⟳ En cours' : '○ À faire'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Toast */}
      <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-red-900 border border-red-500 rounded-lg p-4 shadow-lg animate-pulse">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚠</span>
              <div className="flex-1">
                <p className="font-bold text-red-100">{notif.title}</p>
                <p className="text-sm text-red-200">{notif.boardTitle}</p>
                <p className="text-xs text-red-300 mt-1">Retard: {notif.daysOverdue} jour(s)</p>
              </div>
              <button
                onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                className="text-red-300 hover:text-red-100 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-600 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">👤 Utilisateur actuel</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 transition text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-4">Sélectionner un utilisateur:</p>
            <div className="space-y-2 mb-6">
              {users.map((user) => (
                <button
                  key={user}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserModal(false);
                    addToHistory('switch_user', { user });
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition text-left ${
                    currentUser === user
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                  }`}
                >
                  {user}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-600 pt-4">
              <p className="text-gray-400 text-sm mb-2">Ajouter un nouvel utilisateur:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newUserInput"
                  placeholder="Nom..."
                  className="flex-1 px-3 py-2 bg-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none border border-slate-600 focus:border-blue-500 transition text-sm"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newUserInput');
                    const newUser = input.value.trim();
                    if (newUser && !users.includes(newUser)) {
                      setUsers([...users, newUser]);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto border border-slate-600">
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-600 flex items-center justify-between">
              <h2 className="text-2xl font-bold">⏱️ Historique des modifications</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 transition text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {history.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Aucun historique</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {[...history].reverse().map((entry) => (
                    <div key={entry.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-blue-300">
                            {entry.action === 'create_card' && '➕ Carte créée'}
                            {entry.action === 'delete_card' && '🗑️ Carte supprimée'}
                            {entry.action === 'switch_user' && '👤 Utilisateur changé'}
                            {entry.action === 'update_card' && '✏️ Carte modifiée'}
                          </p>
                          <p className="text-gray-300 text-xs mt-1">
                            {entry.details?.title || entry.details?.user || 'Action'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{entry.user}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(entry.timestamp).toLocaleTimeString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="fixed top-20 left-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-2xl p-6 border border-slate-600 z-40 w-80">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Statut:</label>
              <div className="space-y-1">
                {['todo', 'inprogress', 'done', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    }`}
                  >
                    {status === 'todo' ? '○ À faire' : status === 'inprogress' ? '⟳ En cours' : status === 'done' ? '✓ Terminé' : '📦 Archivé'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Échéances:</label>
              <div className="space-y-1">
                {[
                  { id: 'overdue', label: '🔴 Retard' },
                  { id: 'today', label: '🟡 Aujourd\'hui' },
                  { id: 'week', label: '⏱️ Cette semaine' },
                  { id: 'nodate', label: '⭕ Sans date' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFilterDateRange(filterDateRange === opt.id ? null : opt.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition ${
                      filterDateRange === opt.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setFilterStatus(null);
                setFilterDateRange(null);
                setSearchQuery('');
              }}
              className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-gray-300 transition"
            >
              Réinitialiser tous
            </button>
          </div>
        </div>
      )}
      
      {selectedCard && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] pointer-events-auto">
          <CardModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            availableLabels={allLabels}
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
      <div className={`flex items-center gap-4 mb-8 ${selectedCard ? 'hidden' : ''}`}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Epitrello logo" className="w-12 h-12 rounded-lg shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Epitrello</h1>
            <p className="text-xs text-gray-400 mt-1">{savedAt ? `Enregistré : ${savedAt.toLocaleTimeString()}` : "Synchronisation..."}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input type="file" accept="application/json" ref={fileInputRef} onChange={handleImportFile} className="hidden" />
          
          {/* Search bar */}
          <input
            type="text"
            placeholder="🔍 Chercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm placeholder-gray-500 text-white focus:outline-none border border-slate-600 focus:border-blue-500 transition w-40"
          />
          
          {/* Filters button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              showFiltersPanel ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title="Filtres avancés"
          >
            ⚙️ Filtres
          </button>

          {/* View mode toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title={`Passer à la vue ${viewMode === 'kanban' ? 'tableau' : 'kanban'}`}
          >
            {viewMode === 'kanban' ? '📊 Tableau' : '📋 Liste'}
          </button>

          {/* User selector */}
          <button
            onClick={() => setShowUserModal(!showUserModal)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2 relative"
            title="Changer d'utilisateur"
          >
            👤 {currentUser.split(' ')[0]}
          </button>

          {/* History button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title="Historique"
          >
            ⏱️ Historique
            {history.length > 0 && (
              <span className="bg-slate-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                {history.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setShowDeadlineCalendar(!showDeadlineCalendar)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2 relative"
            title="Calendrier des échéances"
          >
            📅 Échéances
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowLabelsModal(true)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title="Gérer les labels"
          >
            <Settings className="w-4 h-4" />
            Labels
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title="Exporter les données"
          >
            <DownloadCloud className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={triggerImportFile}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title="Importer un fichier JSON"
          >
            <UploadCloud className="w-4 h-4" />
            Importer
          </button>
          <button
            onClick={saveNow}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
            title="Sauvegarder maintenant"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      <div className={`mb-8 flex items-center gap-3 ${selectedCard ? 'pointer-events-none' : ''}`}>
        <input
          placeholder="Nom de la nouvelle liste"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition border border-slate-600 focus:border-blue-500"
        />
        <button 
          onClick={addBoard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
        >
          + Ajouter une liste
        </button>
      </div>

      <div className={`mb-6 flex gap-2 flex-wrap items-center ${selectedCard ? 'pointer-events-none' : ''}`}>
        <span className="text-sm font-semibold text-gray-300">Filtrer par labels:</span>
        {allLabels.map((lbl) => (
          <button
            key={lbl.id}
            onClick={() => {
              setSelectedLabelFilters(
                selectedLabelFilters.includes(lbl.id)
                  ? selectedLabelFilters.filter(l => l !== lbl.id)
                  : [...selectedLabelFilters, lbl.id]
              );
            }}
            className={`text-white px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedLabelFilters.includes(lbl.id) ? 'ring-2 ring-white shadow-lg' : 'opacity-60 hover:opacity-80'
            }`}
            style={{ backgroundColor: lbl.color.startsWith('#') ? lbl.color : lbl.color }}
          >
            {lbl.name}
          </button>
        ))}
        {selectedLabelFilters.length > 0 && (
          <button
            onClick={() => setSelectedLabelFilters([])}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-xs transition"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Vue Tableau */}
      {viewMode === 'table' && (
        <div className={`overflow-x-auto ${selectedCard ? 'hidden' : ''}`}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-800 border-b-2 border-slate-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Titre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Liste</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Statut</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Échéance</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Assigné à</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Labels</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board, boardIdx) => {
                return filterCards(board.cards || []).map((card, displayIdx) => {
                  const realCardIdx = board.cards.indexOf(card);
                  const daysUntil = card.dueDate ? getDaysUntil(card.dueDate) : null;
                  const isOverdue = daysUntil !== null && daysUntil < 0 && card.status !== 'done';

                  return (
                    <tr
                      key={`${boardIdx}-${realCardIdx}`}
                      className="border-b border-slate-700 hover:bg-slate-800/50 transition cursor-pointer"
                      onClick={() => openCardModal(boardIdx, realCardIdx)}
                    >
                      <td className="px-4 py-3 font-medium text-white">{card.title}</td>
                      <td className="px-4 py-3 text-gray-300">{board.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          card.status === 'done' ? 'bg-green-600 text-white' :
                          card.status === 'inprogress' ? 'bg-blue-600 text-white' :
                          card.status === 'archived' ? 'bg-gray-600 text-white' :
                          'bg-slate-500 text-white'
                        }`}>
                          {card.status === 'todo' ? 'À faire' : card.status === 'inprogress' ? 'En cours' : card.status === 'done' ? 'Terminé' : 'Archivé'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {card.dueDate ? (
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            isOverdue ? 'bg-red-900/60 text-red-200' :
                            daysUntil === 0 ? 'bg-yellow-900/60 text-yellow-200' :
                            daysUntil && daysUntil > 0 && daysUntil <= 3 ? 'bg-orange-900/60 text-orange-200' :
                            'bg-slate-700 text-gray-300'
                          }`}>
                            {new Date(card.dueDate).toLocaleDateString('fr-FR')}
                            {daysUntil !== null && ` (J-${daysUntil})`}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">Aucune</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{card.assignedTo || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {(card.labels || []).map((lid) => {
                            const lbl = allLabels.find(l => l.id === lid);
                            return lbl ? (
                              <span
                                key={lid}
                                className="text-white text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: lbl.color.startsWith('#') ? lbl.color : lbl.color }}
                              >
                                {lbl.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCard(boardIdx, realCardIdx);
                          }}
                          className="text-red-400 hover:text-red-300 transition"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
          {boards.every(b => filterCards(b.cards || []).length === 0) && (
            <p className="text-center text-gray-400 py-8">Aucune carte ne correspond aux filtres</p>
          )}
        </div>
      )}

      {/* Vue Kanban */}
      {viewMode === 'kanban' && (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 ${selectedCard ? 'hidden' : ''}`}>
        {boards.map((board, index) => {
          const isDropTargetBoard = listDropTarget === index || (dropTargetInfo && dropTargetInfo.boardIndex === index);
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleBoardDragStart(e, index)}
              onDragOver={(e) => handleDragOverList(e, index)}
              onDrop={(e) => handleBoardDrop(e, index)}
            >
              <div className={`bg-gradient-to-b from-slate-800 to-slate-700 rounded-xl shadow-lg transition-all p-4 ${isDropTargetBoard ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-2xl scale-[1.01]' : 'hover:shadow-xl'}`}>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <EditableListTitle
                        title={board.title}
                        onSave={(newTitle) => {
                          const newBoards = [...boards];
                          newBoards[index].title = newTitle;
                          setBoards(newBoards);
                        }}
                      />
                      {/* Barre de progression */}
                      {board.cards && board.cards.length > 0 && (
                        <div className="mt-2">
                          {(() => {
                            const total = board.cards.length;
                            const done = board.cards.filter(c => c.status === 'done').length;
                            const percentage = Math.round((done / total) * 100);
                            return (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-300 font-semibold w-10 text-right">{percentage}%</span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition font-bold"
                    onClick={() => toggleOptions(index)}
                    title="Options"
                  >
                    ⋯
                  </button>
                {board.showOptions && (
                  <div
                    ref={(el) => (optionRefs.current[index] = el)}
                    className="absolute top-8 right-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-lg shadow-xl p-4 w-56 z-10"
                  >
                    <h3 className="text-sm font-bold mb-3 text-gray-200">Options</h3>
                    <ul className="space-y-2">
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 text-blue-400 hover:bg-slate-700 rounded-lg transition text-sm"
                          onClick={() => addCard(index)}
                        >
                          Ajouter une carte
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition text-sm"
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
              <ul
                className={`space-y-2 mb-4 rounded-lg p-1 transition-all ${listDropTarget === index ? 'bg-slate-700/60 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                onDragEnter={(e) => handleDragEnterList(e, index)}
                onDragOver={(e) => handleDragOverList(e, index)}
                onDragLeave={(e) => handleDragLeaveList(e, index)}
                onDrop={(e) => handleDropOnList(e, index)}
              >
                {board.cards && filterCards(board.cards).map((card, displayIndex) => {
                  const originalCardIndex = board.cards.indexOf(card);
                  const cardStatus = card.status || 'todo';
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dueDateObj = card.dueDate ? new Date(`${card.dueDate}T00:00:00`) : null;
                  const diffDays = dueDateObj ? Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24)) : null;
                  const isCardOverdue = dueDateObj && diffDays !== null && diffDays < 0 && cardStatus !== 'done' && cardStatus !== 'archived';
                  const isDueToday = diffDays === 0;
                  const statusIcon = cardStatus === 'done' ? '✓' : cardStatus === 'inprogress' ? '⟳' : cardStatus === 'archived' ? '📦' : '○';
                  const statusBadgeClass = cardStatus === 'done'
                    ? 'bg-green-600'
                    : cardStatus === 'inprogress'
                      ? 'bg-blue-600'
                      : cardStatus === 'archived'
                        ? 'bg-gray-600'
                        : 'bg-slate-500';
                  const dueBadgeClass = isCardOverdue
                    ? 'bg-red-900/60 text-red-200 border border-red-500/40'
                    : diffDays !== null && diffDays > 0 && diffDays <= 3
                      ? 'bg-yellow-900/60 text-yellow-200 border border-yellow-500/40'
                      : 'bg-slate-500/40 text-gray-200';
                  const dueBadgeLabel = isCardOverdue
                    ? `Retard ${Math.abs(diffDays ?? 0)}j`
                    : isDueToday
                      ? "Aujourd'hui"
                      : diffDays !== null
                        ? `J-${diffDays}`
                        : '';
                  const isDraggingThisCard = draggedCardInfo && draggedCardInfo.boardIndex === index && draggedCardInfo.cardIndex === originalCardIndex;
                  const isDropTarget = dropTargetInfo && dropTargetInfo.boardIndex === index && dropTargetInfo.cardIndex === originalCardIndex;
                  const dropLineStyle = isDropTarget
                    ? { boxShadow: dropTargetInfo.position === 'before' ? '0 -4px 0 0 rgba(96, 165, 250, 0.85)' : '0 4px 0 0 rgba(96, 165, 250, 0.85)' }
                    : {};
                  return (
                    <li
                      key={`card-${originalCardIndex}`}
                      data-card-index={originalCardIndex}
                      style={dropLineStyle}
                      className={`bg-slate-600 hover:bg-slate-500 p-3 rounded-lg shadow-sm flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing text-white transition-all duration-150 group ${isDropTarget ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-700 shadow-lg' : ''} ${isDraggingThisCard ? 'opacity-40 scale-[0.98]' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index, originalCardIndex)}
                      onDragOver={(e) => handleDragOverCard(e, index, originalCardIndex)}
                      onDragLeave={(e) => handleCardDragLeave(e, index, originalCardIndex)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index, originalCardIndex)}
                      onClick={() => openCardModal(index, originalCardIndex)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-sm flex-1 pr-2">{card.title}</div>
                          <div className="flex items-center gap-2">
                            <span className={`${statusBadgeClass} text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1`}>
                              <span>{statusIcon}</span>
                              <span>{cardStatus === 'todo' ? 'À faire' : cardStatus === 'inprogress' ? 'En cours' : cardStatus === 'done' ? 'Terminé' : 'Archivé'}</span>
                            </span>
                            {isCardOverdue && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-600 text-white animate-pulse">
                                ⚠
                              </span>
                            )}
                          </div>
                        </div>

                        {dueDateObj && (
                          <div className={`inline-flex items-center gap-2 text-xs mb-2 px-2 py-1 rounded ${dueBadgeClass}`}>
                            <span>📅 {dueDateObj.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span>
                            {dueBadgeLabel && <span className="font-semibold">{dueBadgeLabel}</span>}
                          </div>
                        )}

                        <div className="flex gap-1 mt-1 flex-wrap">
                          {(card.labels || []).map((lid) => {
                            const lbl = allLabels.find((l) => l.id === lid);
                            if (!lbl) return null;
                            return (
                              <span
                                key={lid}
                                className="text-white text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ backgroundColor: lbl.color.startsWith('#') ? lbl.color : lbl.color }}
                              >
                                {lbl.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCard(index, originalCardIndex);
                        }}
                        className="text-red-400 hover:text-red-300 ml-2 opacity-0 group-hover:opacity-100 transition"
                        aria-label={`Supprimer la carte ${card.title}`}
                        title={`Supprimer ${card.title}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2 items-center">
                <input
                  placeholder="Nom de la carte"
                  value={newCardTitles[index] || ""}
                  onChange={(e) => setNewCardTitles({ ...newCardTitles, [index]: e.target.value })}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 focus:bg-slate-500 px-3 py-2 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none transition border border-slate-500 focus:border-blue-500"
                />
                <button
                  onClick={() => addCard(index)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition"
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
      )}
    </div>
  );
}