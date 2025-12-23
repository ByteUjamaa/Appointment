from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import AppointmentReport


@receiver(pre_save, sender=AppointmentReport)
def set_report_timestamps(sender, instance, **kwargs):

    if not instance.pk:
        return

    previous = AppointmentReport.objects.get(pk=instance.pk)

    if previous.status != 'submitted' and instance.status == 'submitted':
        instance.submitted_at = timezone.now()


    if (
        previous.status != instance.status and
        instance.status in ['approved', 'rejected']
    ):
        instance.reviewed_at = timezone.now()
