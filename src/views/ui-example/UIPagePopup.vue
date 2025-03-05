<template>
    <base-notification-box
        :notification="{
            message: `Уведомление с иконкой, не исчезает.
		dinamicClass: 'alert__success'`,
            alwaysVisible: true,
            picture: true,
            dinamicClass: 'alert__success',
        }"
    >
        <IconSprite
            name="common--info"
            className="icon__svg"
        />
    </base-notification-box>

    <base-notification-box
        :notification="{
            message: `Уведомление с иконкой, не исчезает.
		dinamicClass: 'alert__warning'`,
            alwaysVisible: true,
            picture: true,
            dinamicClass: 'alert__warning',
        }"
    >
        <IconSprite
            name="common--info"
            className="icon__svg"
        />
    </base-notification-box>
    <base-notification-box
        :notification="{
            message: `Уведомление с иконкой, не исчезает.
		dinamicClass: 'alert__cancelled'`,
            alwaysVisible: true,
            picture: true,
            dinamicClass: 'alert__cancelled',
        }"
    >
        <IconSprite
            name="common--off"
            className="icon__svg"
        />
    </base-notification-box>


    <BaseButton
        classNames="font-button_M button button_transparent"
        @click="toggleModal"
        >открыть попап</BaseButton
    >

    <BaseWrapperPopup
        v-if="showModal"
        @close="onCloseModal"
        :hasCloseIcon="false"
    >
        <BaseAlertBoxError
            :alert="arrAlerts[2]"
			:onCloseModal="onCloseModal"
        />
    </BaseWrapperPopup>
</template>

<script setup>
import { ref } from 'vue'
import BaseNotificationBox from '@ui/alert/depricatedBaseNotificationBox.vue'
import IconSprite from '@/components/interface/IconSprite.vue'
import BaseAlertBoxError from '@ui/alert/BaseAlertBoxError.vue'
import BaseWrapperPopup from '@ui/wrapper/BaseWrapperPopup.vue'
import BaseButton from '@ui/buttons/BaseButton.vue'
import { useNotificationStore } from '@/store/notification'

const notificationStore = useNotificationStore()

const arrAlerts = ref([
    {
        id: 1,
        сorrelationId: 'h66224cd6-ef08-41bc-a580-ff087ad2f00b',
        code: 'ValidationException',
        message: 'обычное сообщение об ошибке',
        details: [
            {
                propertyName: 'DailyAllowance.CounterpartyStructureInfo[0].Type',
                errorMessage: 'Свойство <type> не может быть пустым.',
            },
        ],
        inner: null,
        stackTrace:
            '   at Application.Behaviors.RequestValidationBehavior`2.Handle(TRequest request, RequestHandlerDelegate`1 next, CancellationToken cancellationToken) in /src/Core/Application/Behaviors/RequestValidationBehavior.cs:line 27\n   at Presentation.Controllers.DailyAllowancesController.UpdateDailyAllowance(Int64 id, Command command) in /src/Core/Presentation/Controllers/DailyAllowancesController.cs:line 74\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.TaskOfIActionResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)\n   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)\n   at OBT.Tracking.Middlewares.RequestTrackingMiddleware.Invoke(HttpContext context, IRequestTrackingService trackingService)\n   at OBT.Exceptions.Middleware.ExceptionHandlingMiddleware.InvokeAsync(HttpContext context, IErrorCreator errorCreator, IRequestTrackingService trackingService)',
    },
    {
        id: 2,
        removeTimeout: 100000,
        сorrelationId: 'fd00224cd6-ef08-41bc-a580-ff087ad2f00b',
        code: 'ValidationException',
        message: 'Error удалится через 100 секунд',
        details: [
            {
                propertyName: 'DailyAllowance.CounterpartyStructureInfo[0].Type',
                errorMessage: 'Свойство <type> не может быть пустым.',
            },
        ],
        inner: null,
        stackTrace:
            '   at Application.Behaviors.RequestValidationBehavior`2.Handle(TRequest request, RequestHandlerDelegate`1 next, CancellationToken cancellationToken) in /src/Core/Application/Behaviors/RequestValidationBehavior.cs:line 27\n   at Presentation.Controllers.DailyAllowancesController.UpdateDailyAllowance(Int64 id, Command command) in /src/Core/Presentation/Controllers/DailyAllowancesController.cs:line 74\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.TaskOfIActionResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)\n   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)\n   at OBT.Tracking.Middlewares.RequestTrackingMiddleware.Invoke(HttpContext context, IRequestTrackingService trackingService)\n   at OBT.Exceptions.Middleware.ExceptionHandlingMiddleware.InvokeAsync(HttpContext context, IErrorCreator errorCreator, IRequestTrackingService trackingService)',
    },
    {
        id: 3,
        removeTimeout: 10000,
        сorrelationId: 'sd6600224cd6-ef08-41bc-a580-ff087ad2f00b',
        code: 'ValidationException',
        message: 'Ошибка без кнопки',
        details: [
            {
                propertyName: 'DailyAllowance.CounterpartyStructureInfo[0].Type',
                errorMessage: 'Свойство <type> не может быть пустым.',
            },
        ],
        inner: null,
        hideBtnMore: true,
        stackTrace:
            '   at Application.Behaviors.RequestValidationBehavior`2.Handle(TRequest request, RequestHandlerDelegate`1 next, CancellationToken cancellationToken) in /src/Core/Application/Behaviors/RequestValidationBehavior.cs:line 27\n   at Presentation.Controllers.DailyAllowancesController.UpdateDailyAllowance(Int64 id, Command command) in /src/Core/Presentation/Controllers/DailyAllowancesController.cs:line 74\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.TaskOfIActionResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)\n   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)\n   at Microsoft.AspNetCore.Authentication.AuthenticationMiddleware.Invoke(HttpContext context)\n   at OBT.Tracking.Middlewares.RequestTrackingMiddleware.Invoke(HttpContext context, IRequestTrackingService trackingService)\n   at OBT.Exceptions.Middleware.ExceptionHandlingMiddleware.InvokeAsync(HttpContext context, IErrorCreator errorCreator, IRequestTrackingService trackingService)',
    },
])

notificationStore.catchErrors = arrAlerts.value

let showModal = ref(false)

const toggleModal = () => {
    showModal.value = !showModal.value
}

const onCloseModal = () => {
    showModal.value = false
}


</script>

<style scoped lang="scss"></style>
