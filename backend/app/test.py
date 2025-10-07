from django.test import TestCase
from django.urls import reverse

class BasicTest(TestCase):
    def test_home(self):
        response = self.client.get(reverse('hello'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Hello from Django")
