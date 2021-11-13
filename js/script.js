const filterByType = (type, ...values) => values.filter(value => typeof value === type),
	// создается функция, которая полученные данные values проверяет на соответствие типу type и возвращает прошедшие проверку значения values

	hideAllResponseBlocks = () => {
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// получаем все элементы с тэгом div и классом dialog__response-block, полученое преобразуем из NodeList в массив
		responseBlocksArray.forEach(block => block.style.display = 'none');
		// перебираем полученный массив и задаем им display='none'. По итогу весь полученный массив блоков будет скрыт
	},

	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		hideAllResponseBlocks();
		// Скрываем все блоки
		document.querySelector(blockSelector).style.display = 'block';
		// Ищем на странице переданный нам в вызове блок и задаем ему стиль 'block'
		if (spanSelector) {
			document.querySelector(spanSelector).textContent = msgText;
		}
		// Если был передан spanSelector - ищем селектор в документе и вставляем в него msgText
	},

	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
	// Создаем анонимную функцию и передаем ей сообщение, в анонимной функции вызываем функцию, которая показывает блок с ошибкой
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
	// Создаем анонимную функцию и передаем ей сообщение, в анонимной функции вызываем функцию, которая показывает блок с ответом что всё ок
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),
	// Создаем анонимную функцию и передаем ей сообщение, в анонимной функции вызываем функцию, которая показывает блок в случае, если ничего не нашли
	tryFilterByType = (type, values) => {
		try {
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// eval вызывает filterByType, в filterByType передается  type и values, полученный результат обеденяется в строку через ","
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
			// Если строка со значениями существует вывести alertMsg будет равно `Данные с типом ${type}: ${valuesArray}`, иначе - `Отсутствуют данные типа ${type}`;
			showResults(alertMsg);
			// Вызывается функция показа результата и в нее передается полученное сообщение
		} catch (e) {
			showError(`Ошибка: ${e}`);
			// если в ходе выполнения блока try возникла ошибка - вызвать функцию показа ошибки и передать ей в качестве сообщения "е"
		}
	};

const filterButton = document.querySelector('#filter-btn');
// Ищем в документе элемент с id #filter-btn
filterButton.addEventListener('click', e => {
	const typeInput = document.querySelector('#type');
	// Ищем в документе элемент с id #type
	const dataInput = document.querySelector('#data');
	// Ищем в документе элемент с id #data

	if (dataInput.value === '') {
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// Проверяем заполнено ли поле и если нет - выводим кастомное сообщение, что задано в скобках
		showNoResults();
		// Показываем блок с отсутствием результата
	} else {
		dataInput.setCustomValidity('');
		// Проверяем заполнено ли поле и если нет - выводим кастомное сообщение, что задано в скобках
		e.preventDefault();
		// отменяем дефолтное действие элемента
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
		// вызываем функцию фильтрации и передаем данные, которые были в инпутах  с id type и data, предварительно убираем пробелы в начале и конце строки
	}
});

