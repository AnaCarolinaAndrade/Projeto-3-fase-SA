import './CriarProjeto.css';

export default function CriarProjeto() {
  return (
    <div class="application-main">
      <main>
        <div class="container-md px-3 px-md-4 px-lg-5 my-6">
          <h1 class="f2">Create a new repository</h1>
          <p class="text-muted">
            A repository contains all project files, including the revision history.
            Already have a project repository elsewhere?
            <a href="/new/import">Import a repository</a>.
          </p>
          <hr class="my-2"/>
            <p class="text-italic">Required fields are marked with an asterisk (*).</p>

            <form novalidate>
              <fieldset>
                <legend class="sr-only">Repository owner and name</legend>

                <div class="form-group">
                  <label for="owner">Owner <span>*</span></label>
                  <select id="owner" name="owner">
                    <option value="L7noxy">L7noxy</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="repo-name">Repository name <span>*</span></label>
                  <input type="text" id="repo-name" name="repo-name" placeholder="e.g. my-project" required />
                </div>

                <div class="form-suggestion">
                  <p>Great repository names are short and memorable. Need inspiration?</p>
                  <button type="button">automatic-eureka</button>
                </div>
              </fieldset>

              <div class="form-group">
                <label for="description">Description <span>(optional)</span></label>
                <input type="text" id="description" name="description" placeholder="A short description of your project" />
              </div>

              <fieldset>
                <legend>Visibility</legend>

                <div class="form-radio">
                  <input type="radio" id="public" name="visibility" value="public" checked />
                  <label for="public">Public</label>
                  <p>Anyone on the internet can see this repository. You choose who can commit.</p>
                </div>

                <div class="form-radio">
                  <input type="radio" id="private" name="visibility" value="private" />
                  <label for="private">Private</label>
                  <p>Only you and the people you choose can see this repository.</p>
                </div>
              </fieldset>

              <button type="submit" class="btn btn-primary mt-4">Create repository</button>
            </form>
        </div>
      </main>
    </div>

  );
}
