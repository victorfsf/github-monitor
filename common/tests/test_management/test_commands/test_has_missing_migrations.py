from unittest.mock import MagicMock, patch

from django.db.migrations.autodetector import MigrationAutodetector
from django.db.migrations.executor import MigrationExecutor
from django.db.utils import OperationalError
from django.test import TestCase

from common.management.commands.has_missing_migrations import Command


class TestCommand(TestCase):

    def setUp(self):
        self.command = Command()

    def test_add_arguments(self):
        parser = MagicMock()
        self.command.add_arguments(parser)
        parser.add_argument.assert_called_with(
            '--ignore',
            action='store',
            nargs='+',
            dest='ignore',
            default=[],
            help="Comma separated list of apps to ignore missing migration files. "
            "Useful for specifying third-party ones here."
        )

    @patch('sys.stdout.write')
    def test_handle(self, sys_write):
        self.command.stdout.write = MagicMock()
        self.command.handle(ignore=[])
        sys_write.assert_called_with('All migration files present\n')
        self.command.stdout.write.assert_called_with('Checking...')

    @patch.object(MigrationAutodetector, 'changes')
    @patch('sys.exit')
    def test_handle_has_changes(self, sys_exit, changes):
        changes().keys.return_value = ['change']
        self.command.handle(ignore=[])
        changes.assert_called()
        sys_exit.assert_called_with(
            "Apps with model changes but no corresponding migration file: %(changed)s\n" % {
                'changed': ['change']
            }
        )

    @patch('sys.stdout.write')
    @patch('sys.exit')
    @patch.object(MigrationAutodetector, 'changes')
    def test_handle_ignore_changes(self, changes, sys_exit, sys_write):
        changes().keys.return_value = ['change']
        self.command.handle(ignore=['change'])
        changes.assert_called()
        sys_write.assert_called()
        sys_exit.assert_not_called()

    @patch('sys.exit')
    @patch.object(MigrationExecutor, '__init__')
    def test_handle_operational_error(self, executor, sys_exit):
        executor.side_effect = OperationalError()
        self.command.handle(ignore=[])
        sys_exit.assert_called_with(
            'Unable to check migrations: cannot connect to database\n'
        )
