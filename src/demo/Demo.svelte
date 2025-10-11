<script>
  import FuzzyTable from '../FuzzyTable.svelte';

  // Sample data for demo
  let data = $state([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', active: true },
    { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'Editor', active: false },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', active: true },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', active: true },
  ]);

  const head = [
    { id: 'id', name: 'ID', sortDir: 'ascending' },
    { id: 'name', name: 'Name' },
    { id: 'email', name: 'Email' },
    { id: 'role', name: 'Role' },
    { id: 'active', name: 'Active', type: 'bool' },
  ];

  const options = {
    pageSize: 10,
    numberCol: true,
    t: { search_placeholder: 'Search users...' }
  };

  // Demo: Add a new user
  function addUser() {
    const newUser = {
      id: data.length + 1,
      name: `User ${data.length + 1}`,
      email: `user${data.length + 1}@example.com`,
      role: 'User',
      active: true
    };
    data = [...data, newUser];
  }

  // Demo: Remove last user
  function removeUser() {
    if (data.length > 0) {
      data = data.slice(0, -1);
    }
  }

  // Demo: Toggle active status of first user
  function toggleFirst() {
    if (data.length > 0) {
      const updated = [...data];
      updated[0] = { ...updated[0], active: !updated[0].active };
      data = updated;
    }
  }
</script>

<div class="demo-container">
  <h1>FuzzyTable Svelte 5 Demo</h1>

  <div class="controls">
    <button onclick={addUser}>Add User</button>
    <button onclick={removeUser}>Remove User</button>
    <button onclick={toggleFirst}>Toggle First User Active</button>
  </div>

  <FuzzyTable {data} {head} {options} />
</div>

<style>
  .demo-container {
    max-width: 80rem;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  .controls {
    margin-bottom: 1.5rem;
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: #0891b2;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }

  button:hover {
    background: #0e7490;
  }
</style>
