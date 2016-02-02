// Style properties behavior
// =========================

window.Barvian = window.Barvian || {};
Barvian.StylePropertiesBehavior = {

  beforeRegister() {
    // Add observers to style properties then merge with regular properties
    this.properties = {
      ...this.properties,
      ...Object.keys(this.styleProperties).reduce((props, prop) => {
        const observer = `_${prop}Updated`;

        // Add observer function to element
        this[observer] = function(newValue, oldValue) {
          this.customStyle[`--${this.is}-${prop}`] = newValue;
        };

        // Add observer to property
        props[prop] = {
          ...this.styleProperties[prop],
          observer: observer
        };

        return props;
      }, {})
    };
  }

};
