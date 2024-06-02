// Когда html документ готов (прорисован)
$(document).ready(function () {
    // берем в переменную элемент разметки с id jq-notification для оповещений от ajax
    var successMessage = $("#jq-notification");

    // Ловим собыитие клика по кнопке добавить в корзину
    $(document).on("click", ".add-to-experiment", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInExperimentCount = $("#goods-in-experiment-count");
        var experimentCount = parseInt(goodsInExperimentCount.text() || 0);

        // Получаем id товара из атрибута data-product-id
        var item_id = $(this).data("item-id");

        // Из атрибута href берем ссылку на контроллер django
        var add_to_experiment_url = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({
            type: "POST",
            url: add_to_experiment_url,
            data: {
                item_id: item_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                experimentCount++;
                goodsInExperimentCount.text(experimentCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var experimentItemsContainer = $("#experiment-items-container");
                experimentItemsContainer.html(data.experiment_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });




    // Ловим событие клика по кнопке удалить товар из корзины
    $(document).on("click", ".remove-from-experiment", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInExperimentCount = $("#goods-in-experiment-count");
        var experimentCount = parseInt(goodsInExperimentCount.text() || 0);

        // Получаем id корзины из атрибута data-cart-id
        var experiment_id = $(this).data("experiment-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_experiment = $(this).attr("href");

        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_experiment,
            data: {
                experiment_id: experiment_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                experimentCount -= data.quantity_deleted;
                goodsInExperimentCount.text(experimentCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var experimentItemsContainer = $("#experiment-items-container");
                experimentItemsContainer.html(data.experiment_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });




    // Теперь + - количества товара
    // Обработчик события для уменьшения значения
    $(document).on("click", ".decrement", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("experiment-change-url");
        // Берем id корзины из атрибута data-cart-id
        var experimentID = $(this).data("experiment-id");
        // Ищем ближайшеий input с количеством, выловили значение из инпута
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());
        // Если количества больше одного, то только тогда делаем -1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Запускаем функцию определенную ниже
            // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
            updateExperiment(experimentID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения значения
    $(document).on("click", ".increment", function () {
        // Берем ссылку на контроллер django из атрибута data-cart-change-url
        var url = $(this).data("experiment-change-url");
        // Берем id корзины из атрибута data-cart-id
        var experimentID = $(this).data("experiment-id");
        // Ищем ближайшеий input с количеством
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Запускаем функцию определенную ниже
        // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
        updateExperiment(experimentID, currentValue + 1, 1, url);
    });

    function updateExperiment(experimentID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                experiment_ID: experimentID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },

            success: function (data) {
                 // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                 // Через 7сек убираем сообщение
                setTimeout(function () {
                     successMessage.fadeOut(400);
                }, 7000);

                // Изменяем количество товаров в корзине
                var goodsInExperimentCount = $("#goods-in-experiment-count");
                var experimentCount = parseInt(goodsInExperimentCount.text() || 0);
                experimentCount += change;
                goodsInExperimentCount.text(experimentCount);

                // Меняем содержимое корзины
                var experimentItemsContainer = $("#experiment-items-container");
                experimentItemsContainer.html(data.experiment_items_html);

            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    }

    // Берем из разметки элемент по id - оповещения от django
    var notification = $('#notification');
    // И через 7 сек. убираем
    if (notification.length > 0) {
        setTimeout(function () {
            notification.alert('close');
        }, 7000);
    }

    // При клике по значку корзины открываем всплывающее(модальное) окно
    $('#modalButton').click(function () {
        $('#exampleModal').appendTo('body');

        $('#exampleModal').modal('show');
    });

    // Собыите клик по кнопке закрыть окна корзины
    $('#exampleModal .btn-close').click(function () {
        $('#exampleModal').modal('hide');
    });

    // Обработчик события радиокнопки выбора способа доставки
    $("input[name='requires_delivery']").change(function () {
        var selectedValue = $(this).val();
        // Скрываем или отображаем input ввода адреса доставки
        if (selectedValue === "1") {
            $("#deliveryAddressField").show();
        } else {
            $("#deliveryAddressField").hide();
        }
    });

})
