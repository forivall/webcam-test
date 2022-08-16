function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
	// Good to go!
} else {
	alert('getUserMedia() is not supported by your browser');
}

var selectedCamera = '';

function askForPermission(){
    let constraints = { video : true };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(() => {
        // alert("Permission Granted!");
        populateCameraList();
    })
    .catch(() => {
        alert("TODO: write error message for when camera permisison is denied!");
    });
}


/** @type {HTMLSelectElement} */
let cameraSelect
document.addEventListener('DOMContentLoaded', () => {
	cameraSelect = document.querySelector('#camera-select')
	askForPermission();
	cameraSelect.onchange = () => {
		// console.log("New selection!")
		/** @type {HTMLOptionElement} */
		let new_selection = cameraSelect.children[
			cameraSelect.selectedIndex
		];
		selectedCamera = new_selection.value;
		setCamera();
	};

	/** @type {HTMLButtonElement} */
	const hideButton = document.querySelector('#camera-select-hide');
	hideButton.onclick = () => {
		/** @type {HTMLDivElement} */
		const container = document.querySelector('#camera-select-container');
		container.style.display = 'none';
	}
	//     populateCameraList();
});

function populateCameraList() {
	cameraSelect.innerHTML = '';

	navigator.mediaDevices.enumerateDevices().then((deviceList) => {
		console.log(deviceList);

		selectedCamera = deviceList.filter((x) => x.kind == 'videoinput')[0].deviceId;
		setCamera();

		deviceList.forEach((device) => {
			if (device.kind == 'videoinput') {
				console.log(device.label);
				let item = document.createElement('option');
				// item.setAttribute("value", device.label);
				item.value = device.deviceId;
				item.innerHTML = device.label;
				cameraSelect.appendChild(item);
			}
		});
	});
}

function setCamera() {
	let constraints = {
		video: {
			deviceId: selectedCamera
		}
	};

	navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		/** @type {HTMLVideoElement} */
		let video = document.querySelector('#webcam-output');
		video.srcObject = stream;
		video.play();
	});
}
