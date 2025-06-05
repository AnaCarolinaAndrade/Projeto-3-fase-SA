import './CriarProjeto.css';

export default function CriarProjeto() {
  return (
    <div className="application-main">
      <main>
        <div className="container">
          <h1 className="title">Create a new repository</h1>
          <p className="subtitle">
            A repository contains all project files, including the revision history.
            Already have a project repository elsewhere?{' '}
            <a href="/new/import">Import a repository</a>.
          </p>
          <hr className="divider" />
          <p className="required-note">Required fields are marked with an asterisk (*).</p>

          <form noValidate>
            <fieldset>
              <legend className="sr-only">Repository owner and name</legend>

              <div className="form-group">
                <label htmlFor="owner">Owner <span>*</span></label>
                <select id="owner" name="owner">
                  <option value="L7noxy">L7noxy</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="repo-name">Repository name <span>*</span></label>
                <input
                  type="text"
                  id="repo-name"
                  name="repo-name"
                  placeholder="e.g. my-project"
                  required
                />
              </div>

              <div className="form-suggestion">
                <p>Great repository names are short and memorable. Need inspiration?</p>
                <button type="button">automatic-eureka</button>
              </div>
            </fieldset>

            <div className="form-group">
              <label htmlFor="description">Description <span>(optional)</span></label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="A short description of your project"
              />
            </div>

            <fieldset>
              <legend>Visibility</legend>

              <div className="form-radio">
                <input type="radio" id="public" name="visibility" value="public" defaultChecked />
                <label htmlFor="public">Public</label>
                <p>Anyone on the internet can see this repository. You choose who can commit.</p>
              </div>

              <div className="form-radio">
                <input type="radio" id="private" name="visibility" value="private" />
                <label htmlFor="private">Private</label>
                <p>Only you and the people you choose can see this repository.</p>
              </div>
            </fieldset>

            <button type="submit" className="btn-primary">Create repository</button>
          </form>
        </div>
      </main>
    </div>
  );
}
