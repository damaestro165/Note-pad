import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NewNote } from './NewNote';
import { useLocalStorage } from './useLocalStorage';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

//30:00 continue tomorrow

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type Note = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...notes,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />}>
        <Route index element={<h1>Home</h1>} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} />} />
        <Route path='/:id'>
          <Route index element={<h1>Show</h1>} />
          <Route path=' edit' element={<h1>edit</h1>} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    )
  );

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

const Root = () => {
  return (
    <Container className='my-4'>
      <Outlet />
    </Container>
  );
};

export default App;