<div>
  <h2>Create a Pet Profile</h2>
  <form action="?/createPetProfile" method="POST">
    <label>
      name your pet
      <input type="text" name="pet" />
    </label>
    <label>
      What type of animal?
      <input type="text" name="petType" />
    </label>
    <label>
      pet age
      <input type="text" name="age" />
    </label>
    <label>
      date of birth
      <input type="date" name="dob" />
    </label>
    <label>
      weight
      <input type="number" name="weight" />
    </label>
    <button aria-label="create pet profile">create pet profile</button>
  </form>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
  div > form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 35vh;
    label {
      border: 1.5px solid blue;
      input {
        width: 80%;
      }
    }
  }

  button {
    width: 50%;
  }
</style>
