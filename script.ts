interface Vehicle {
    name: string;
    plate: string;
    entry: Date | string;
  }
  
  (function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
  
    function calculateTime(mil: number) {
      const min = Math.floor(mil / 60000);
      const sec = Math.floor((mil % 60000) / 1000);
  
      return `${min}m e ${sec}s`;
    }
  
    function parkingLot() {
      function read(): Vehicle[] {
        return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
      }
  
      function save(vehicles: Vehicle[]) {
        localStorage.setItem("parkingLot", JSON.stringify(vehicles));
      }
  
      function add(vehicle: Vehicle, saveVehicle?: boolean) {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td class="name">${vehicle.name}</td>
          <td class="plate">${vehicle.plate}</td>
          <td class="entry">${vehicle.entry}</td>
          <td>
              <button class="delete" data-plate="${vehicle.plate}">x</button>
          </td>
        `;
  
        $("#parkingLot")?.appendChild(row);
  
        row.querySelector(".delete")?.addEventListener("click", function () {
            const plate = this.getAttribute("data-plate");
            if (plate) {
                remove(plate);
            } else {
                console.error("Placa não encontrada!");
            }
        });
        
  
        if (saveVehicle) save([...read(), vehicle]);
      }
  
      function remove(plate: string) {
        if (!plate) return;
  
        const vehicles = read();
        const vehicle = vehicles.find((v) => v.plate === plate);
  
        if (!vehicle) {
          alert("Veículo não encontrado!");
          return;
        }
  
        const { entry, name } = vehicle;
        const time = calculateTime(new Date().getTime() - new Date(entry).getTime());
  
        if (!confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`)) return;
  
        save(vehicles.filter((v) => v.plate !== plate));
        render();
      }
  
      function render() {
        $("#parkingLot")!.innerHTML = "";
        const vehicles = read();
  
        if (vehicles.length) {
          vehicles.forEach((vehicle) => add(vehicle));
        }
      }
  
      return { read, add, remove, save, render };
    }
  
    parkingLot().render();
  
    $("#btnRegister")?.addEventListener("click", () => {
      let name = $("#name")?.value;
      let plate = $("#plate")?.value;
  
      if (!name || !plate) {
        alert("Os campos nome e placa são obrigatórios");
        return;
      }
  
      parkingLot().add({ name, plate, entry: new Date().toISOString() }, true);
    });
  })();
  