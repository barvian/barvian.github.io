// Style properties behavior
// =========================

window.Barvian = window.Barvian || {};
Barvian.StylePropertiesBehavior = {

  beforeRegister() {
    if (!this.observers) {
      this.observers = [];
    }
    if (!this.properties) {
      this.properties = {};
    }

    Object.keys(this.properties)
      .filter(prop => this.properties[prop].reflectToStyle)
      // For each style property...
      .forEach(prop => {
        const observerName = `_${prop}Updated`;

        // ... set to String if unspecified
        if (!this.properties[prop].type) {
          this.properties[prop].type = String;
        }

        // ...add an observer function to the element
        this[observerName] = function(newValue) {
          this.customStyle[`--${this.is}-${prop}`] = newValue;
          this.updateStyles();
        };
        this.observers.push(`${observerName}(${prop})`);
      });
  }

};
