(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calculateTime(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function parkingLot() {
        function read() {
            return localStorage.parkingLot ? JSON.parse(localStorage.parkingLot) : [];
        }
        function save(vehicles) {
            localStorage.setItem("parkingLot", JSON.stringify(vehicles));
        }
        function add(vehicle, saveVehicle) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${vehicle.name}</td>
          <td>${vehicle.plate}</td>
          <td>${vehicle.entry}</td>
          <td>
              <button class="delete" data-plate="${vehicle.plate}">x</button>
          </td>
        `;
            (_a = $("#parkingLot")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
            (_b = row.querySelector(".delete")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
                const plate = this.getAttribute("data-plate");
                if (plate) {
                    remove(plate);
                }
                else {
                    console.error("Placa não encontrada!");
                }
            });
            if (saveVehicle)
                save([...read(), vehicle]);
        }
        function remove(plate) {
            if (!plate)
                return;
            const vehicles = read();
            const vehicle = vehicles.find((v) => v.plate === plate);
            if (!vehicle) {
                alert("Veículo não encontrado!");
                return;
            }
            const { entry, name } = vehicle;
            const time = calculateTime(new Date().getTime() - new Date(entry).getTime());
            if (!confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`))
                return;
            save(vehicles.filter((v) => v.plate !== plate));
            render();
        }
        function render() {
            $("#parkingLot").innerHTML = "";
            const vehicles = read();
            if (vehicles.length) {
                vehicles.forEach((vehicle) => add(vehicle));
            }
        }
        return { read, add, remove, save, render };
    }
    parkingLot().render();
    (_a = $("#btnRegister")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        parkingLot().add({ name, plate, entry: new Date().toISOString() }, true);
    });
})();
