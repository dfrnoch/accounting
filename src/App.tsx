import { For, createEffect, createSignal } from "solid-js";
import "./App.css";
import { Post, createPost, getPosts } from "./bindings";

function App() {
  const [greetMsg, setGreetMsg] = createSignal<Post[]>();
  const [name, setName] = createSignal("");

  createEffect(async () => {
    setGreetMsg(await getPosts())
  })

  async function greet() {
    createPost({
      title: name(),
      content: "Hello from Solid!",
    });

  }

  return (
    <div class="container">
      <h1>Welcome to Tauri!</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <For each={greetMsg()}>
        {(msg) => (
          <div>
            <h1>{msg.title}</h1>
            <p>{msg.content}</p>
          </div>
        )}
        </For>
        
    </div>
  );
}

export default App;
