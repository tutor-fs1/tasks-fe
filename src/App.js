import { useEffect, useRef, useState } from 'react';
import css from './App.module.css';
const API_ENDPOINT = 'http://localhost:5000/tasks/';

function App() {
  const [editing, setEditing] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const textRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(API_ENDPOINT)
      .then(res => res.json())
      .then(d => {
        setTasks(d);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false)
      });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const text = form.elements.text.value;
    if (!text) {
      return;
    }
    setLoading(true);
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }) // "{text: "adasdasdadada"}"
    })
      .then(res => res.json())
      .then((newTask) => {
        setTasks((oldTasks) => [...oldTasks, newTask]);
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
        form.reset();
      });
  };
  const handleDelete = (id) => {
    fetch(API_ENDPOINT + id, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then((deletedTask) => {
        setTasks((oldTasks) => oldTasks.filter(ot => ot._id !== deletedTask._id));
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false)
      });
  }
  const handleUpdate = (id) => {
    if (!textRef.current.value) {
      return;
    }
    fetch(API_ENDPOINT + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: textRef.current.value })
    })
      .then(res => res.json())
      .then((newTask) => {
        setTasks((oldTasks) => {
          const newTasks = oldTasks.map((t) => {
            if (t._id !== id) {
              return t;
            }
            return newTask;
          });
          return newTasks;
        });
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
        setEditing(null);
      });
  }
  return (
    <div className={css.app}>
      <form className={css.form} onSubmit={handleSubmit}>
        <input name="text" className={css.input} />
        <Btn disabled={loading}>
          Add task
        </Btn>
      </form>
      <ul className={css.list}>
        {tasks && tasks.length > 0 && tasks.map((t) => {
          return <li key={t._id}>
            {editing === t._id
              ? <div className={css.wrapper}>
                <input ref={textRef} className={css.text} defaultValue={t.text} />
                <Btn disabled={loading} onClick={() => setEditing(null)}>Cancel</Btn>
                <Btn disabled={loading} onClick={() => handleUpdate(t._id)}>Update</Btn>
              </div>
              : <div className={css.wrapper}>
                <p className={css.text}>{t.text}</p>
                <Btn disabled={loading} onClick={() => setEditing(t._id)}>Edit</Btn>
                <Btn disabled={loading} onClick={() => handleDelete(t._id)}>Delete</Btn>
              </div>
            }
          </li>
        })}
      </ul>
    </div>
  );
}

const Btn = ({ onClick, children, disabled = false }) => {
  return <button
    type='submit'
    className={css.button}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
}

export default App;
