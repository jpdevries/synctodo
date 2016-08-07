var ToDoForm = React.createClass({
  render:function(){
    return (

      <form action="/" method="post" id="todo" class="box">
        <header class="add-item">
          <h1 id="task-list"><a href="/" class="subtle">Todo List</a></h1>
          <label for="new-item">Add a New Task</label>
          <div class="new-item__bar">
            <input required="" autocomplete="off" autofocus="" type="text" id="new-item" name="new-item" placeholder="Something to do…" />
            <button type="submit" formaction="/" formmethod="post">Add Task</button>
          </div>
        </header>
      </form>

    );
  }
});
